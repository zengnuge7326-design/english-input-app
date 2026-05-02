# 本地语料音频目录

- 将你的人声音频文件放在此目录，例如：`hello.mp3`。
- 在 `src/data/ttsAudioMap.json` 里建立文本到文件名映射。
- 运行时会优先命中这里的音频，未命中则自动回退系统语音。

示例：

```json
{
  "hello": "hello.mp3",
  "how are you": "how-are-you.mp3"
}
```
