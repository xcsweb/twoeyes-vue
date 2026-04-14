import re

with open("src/router/index.ts", "r") as f:
    content = f.read()

# First remove type definitions
content = re.sub(r'export type NavTarget[\s\S]*?\}\n', '', content)
content = re.sub(r'\s*nav\?:\s*NavMeta;', '', content)

def remove_nav(text):
    while True:
        match = re.search(r'(\s*)nav:\s*\{', text)
        if not match:
            break
        
        start_idx = match.start()
        
        # Find closing brace
        brace_count = 0
        end_idx = -1
        in_brace = False
        
        for i in range(start_idx + len(match.group(1)) + 4, len(text)):
            if text[i] == '{':
                in_brace = True
                brace_count += 1
            elif text[i] == '}':
                brace_count -= 1
                if in_brace and brace_count == 0:
                    end_idx = i
                    break
                    
        if end_idx != -1:
            # Check for trailing comma
            remove_end = end_idx + 1
            while remove_end < len(text) and text[remove_end] in [' ', '\n', '\r']:
                remove_end += 1
            if remove_end < len(text) and text[remove_end] == ',':
                remove_end += 1
                
            # check for preceding comma
            remove_start = start_idx
            while remove_start > 0 and text[remove_start-1] in [' ', '\n', '\r']:
                remove_start -= 1
            if remove_start > 0 and text[remove_start-1] == ',':
                remove_start -= 1
                
            text = text[:remove_start] + text[remove_end:]
        else:
            break
    return text

content = remove_nav(content)

# Remove empty meta
content = re.sub(r',\s*meta:\s*\{\s*\}', '', content)
content = re.sub(r'\s*meta:\s*\{\s*\}', '', content)

with open("src/router/index.ts", "w") as f:
    f.write(content)
