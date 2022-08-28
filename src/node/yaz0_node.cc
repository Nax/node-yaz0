#include <cstdio>
#include <napi.h>
#include <yaz0.h>

#define BUFFER_SIZE 4096

namespace
{

Napi::FunctionReference constructor;

class Yaz0StreamWorker : public Napi::AsyncProgressQueueWorker<char>
{
public:
    Yaz0StreamWorker(Napi::Function& callback, Yaz0Stream* stream, Napi::Buffer<uint8_t>& input)
    : Napi::AsyncProgressQueueWorker<char>(callback)
    , _stream{stream}
    , _input(input.Data())
    , _inputSize(input.Length())
    , _eof{false}
    , _inputRef{Napi::Reference<Napi::Buffer<uint8_t>>::New(input)}
    {
    }

    void Execute(const ExecutionProgress& progress) override
    {
        int ret;
        bool running;
        char outBuf[BUFFER_SIZE];

        /* Set the buffers */
        yaz0Input(_stream, _input, _inputSize);
        yaz0Output(_stream, outBuf, BUFFER_SIZE);

        /* Run */
        running = true;
        while (running)
        {
            ret = yaz0Run(_stream);
            switch (ret)
            {
            case YAZ0_OK:
                _eof = true;
                /* Fallthrough */
            case YAZ0_NEED_AVAIL_IN:
                running = false;
                break;
            case YAZ0_NEED_AVAIL_OUT:
                /* We need more space */
                progress.Send(outBuf, yaz0OutputChunkSize(_stream));
                yaz0Output(_stream, outBuf, BUFFER_SIZE);
                break;
            case YAZ0_BAD_MAGIC:
                SetError("Bad Magic");
                return;
            }
        }

        /* If there is still data, send it */
        if (yaz0OutputChunkSize(_stream))
            progress.Send(outBuf, yaz0OutputChunkSize(_stream));
    }

    void OnProgress(const char* data, size_t size) override
    {
        Napi::Env env = Env();
        Napi::HandleScope scope(env);

        Napi::Buffer<uint8_t> buffer = Napi::Buffer<uint8_t>::Copy(env, reinterpret_cast<const uint8_t*>(data), size);
        Callback().Call({env.Null(), buffer});
    }

    std::vector<napi_value> GetResult(Napi::Env env) override
    {
        if (_eof)
            return {env.Null(), env.Null()};
        else
            return {};
    }

private:
    Yaz0Stream* _stream;
    const void* _input;
    size_t      _inputSize;
    bool        _eof;

    Napi::Reference<Napi::Buffer<uint8_t>>  _inputRef;
};

class Yaz0StreamWrapper : public Napi::ObjectWrap<Yaz0StreamWrapper>
{
public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports)
    {
        Napi::HandleScope scope(env);
        Napi::Function stream = DefineClass(env, "Yaz0Stream", { InstanceMethod("transform", &Yaz0StreamWrapper::Transform) });

        constructor = Napi::Persistent(stream);
        constructor.SuppressDestruct();

        exports.Set("Yaz0Stream", stream);
        return exports;
    }

    Yaz0StreamWrapper(const Napi::CallbackInfo& info)
    : Napi::ObjectWrap<Yaz0StreamWrapper>(info)
    , _stream(nullptr)
    {
        Napi::Env env = info.Env();
        Napi::HandleScope scope(env);

        if (info.Length() != 3 || !info[0].IsBoolean() || !info[1].IsNumber() || !info[2].IsNumber())
        {
            Napi::TypeError::New(env, "Expected boolean and number").ThrowAsJavaScriptException();
            return;
        }
        bool compress = info[0].As<Napi::Boolean>().Value();
        uint32_t size = info[1].As<Napi::Number>().Uint32Value();
        int32_t level = info[2].As<Napi::Number>().Int32Value();

        yaz0Init(&_stream);
        if (compress)
            yaz0ModeCompress(_stream, size, level);
        else
            yaz0ModeDecompress(_stream);
    }

    ~Yaz0StreamWrapper()
    {
        if (_stream)
            yaz0Destroy(_stream);
    }

    Napi::Value Transform(const Napi::CallbackInfo& info)
    {
        Napi::Env env = info.Env();
        Napi::HandleScope scope(env);

        if (info.Length() < 3)
        {
            Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
            return env.Null();
        }

        if (!info[0].IsBuffer() || !info[2].IsFunction())
        {
            Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
            return env.Null();
        }

        Napi::Buffer<uint8_t> input = info[0].As<Napi::Buffer<uint8_t>>();
        Napi::Function callback = info[2].As<Napi::Function>();

        Yaz0StreamWorker* worker = new Yaz0StreamWorker(callback, _stream, input);
        worker->Queue();

        return env.Undefined();
    }

private:
    Yaz0Stream* _stream;
};

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    Yaz0StreamWrapper::Init(env, exports);
    return exports;
}


NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)

}
