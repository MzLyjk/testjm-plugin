import os
import sys
import argparse
from jmcomic import *

def download_comic(comic_id, output_dir):
    try:
        # 设置下载选项
        option = create_option({
            'output_dir': output_dir,
            'download_avatar': False,
            'download_image': True,
            'threading': True,
            'max_threads': 5,
            'max_retry': 3
        })
        
        # 创建客户端
        client = JmcomicClient(option)
        
        # 下载本子
        album = client.get_album_detail(comic_id)
        client.download_album(album)
        
        return True
    except Exception as e:
        print(f"下载出错: {str(e)}")
        return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='JMComic Downloader')
    parser.add_argument('comic_id', type=str, help='Comic ID')
    parser.add_argument('output_dir', type=str, help='Output directory')
    
    args = parser.parse_args()
    
    if download_comic(args.comic_id, args.output_dir):
        print("下载成功")
        sys.exit(0)
    else:
        print("下载失败")
        sys.exit(1)