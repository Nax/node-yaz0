#include <yaz0.h>

Yaz0Stream* emYaz0Init(void)
{
    Yaz0Stream* stream;
    if (yaz0Init(&stream) == YAZ0_OK)
        return stream;
    return NULL;
}
