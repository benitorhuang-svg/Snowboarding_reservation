import os
import re

base_dir = r'C:\Users\benit\Desktop\Snowboarding\frontend\src'
aliases = {
    '@core': os.path.join(base_dir, 'core'),
    '@features': os.path.join(base_dir, 'features'),
    '@services': os.path.join(base_dir, 'services'),
    '@': base_dir
}

def resolve_alias(file_path, import_path):
    if not import_path.startswith('.'):
        return None
    
    # 取得引用檔案的目錄
    file_dir = os.path.dirname(file_path)
    # 計算被引用檔案的絕對路徑
    abs_import_path = os.path.normpath(os.path.join(file_dir, import_path))
    
    # 檢查是否在 src 目錄內
    if not abs_import_path.startswith(base_dir):
        # 檢查是否指向 packages/shared
        shared_path = os.path.normpath(os.path.join(base_dir, '..', '..', 'packages', 'shared', 'src'))
        if abs_import_path.startswith(shared_path):
            rel_to_shared = os.path.relpath(abs_import_path, shared_path).replace('\\', '/')
            return f'@shared/{rel_to_shared}' if rel_to_shared != '.' else '@shared'
        return None

    # 嘗試匹配最長的別名
    best_alias = None
    best_rel_path = None
    
    # 排序別名，讓更具體的（如 @features）優先於通用的（@）
    for alias, alias_path in sorted(aliases.items(), key=lambda x: len(x[1]), reverse=True):
        if abs_import_path.startswith(alias_path):
            rel_path = os.path.relpath(abs_import_path, alias_path).replace('\\', '/')
            if rel_path == '.':
                return alias
            return f'{alias}/{rel_path}'

    return None

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    def replace_func(match):
        quote = match.group(1)
        import_path = match.group(2)
        new_path = resolve_alias(file_path, import_path)
        if new_path:
            # 如果新路徑指向同一個檔案，通常保持 ./ 更好，但依照要求我們儘量用別名
            # 除非是 index.ts 內的相對導出
            if os.path.basename(file_path) == 'index.ts' and import_path.startswith('./'):
                return match.group(0)
            return f'from {quote}{new_path}{quote}'
        return match.group(0)

    # 匹配 from '...' 或 from "..."
    new_content = re.sub(r'from\s+([\'"])(.*?)([\'"])', replace_func, content)
    
    # 處理 import '...' (無 from)
    def replace_import_func(match):
        quote = match.group(1)
        import_path = match.group(2)
        new_path = resolve_alias(file_path, import_path)
        if new_path:
             return f'import {quote}{new_path}{quote}'
        return match.group(0)
    
    new_content = re.sub(r'import\s+([\'"])(.*?)([\'"])', replace_import_func, new_content)

    if content != new_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            full_path = os.path.join(root, file)
            if process_file(full_path):
                print(f'Updated: {full_path}')
