import pickle
import sys
import json
from collections import Counter

# 用于缓存 pickle 文件的数据
cache = None

# 加载 pickle 文件
def load_pickle(file_path):
    global cache
    if cache is None:  # 如果缓存为空，则加载文件
        try:
            with open(file_path, "rb") as f:
                cache = pickle.load(f)
        except Exception as e:
            return {"error": str(e)}
    return cache

# 查询某个键的内容
def query_key(input_key):
    data = load_pickle("xiaohongshu")
    if isinstance(data, dict) and input_key in data:
        result = Counter(data[input_key])  # 假设值是可统计的列表，计算 Counter
        return json.dumps(result, ensure_ascii=False)  # 输出 JSON 格式，保留中文
    else:
        return json.dumps({"error": f"Key '{input_key}' not found"}, ensure_ascii=False)

# 处理传入参数
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input provided"}, ensure_ascii=False))
        sys.exit(1)

    if sys.argv[1] == 'load':
        # 只加载 pickle 文件并缓存
        load_pickle("xiaohongshu")
        print(json.dumps({"status": "data loaded successfully"}, ensure_ascii=False))
    else:
        # 查询某个键
        input_key = sys.argv[1]
        result = query_key(input_key)
        print(result)
