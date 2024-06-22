#!/bin/bash

# VTuberのアバター画像を確認するディレクトリ
VTUBERS_DIR="public/images/vtubers"

# デフォルトのアバター画像の確認
if [ -f "public/images/default-avatar.png" ]; then
    echo "✅ デフォルトのアバター画像が存在します"
else
    echo "❌ デフォルトのアバター画像が見つかりません: public/images/default-avatar.png"
fi

# 各VTuberのディレクトリをチェック
for vtuber_dir in "$VTUBERS_DIR"/*; do
    if [ -d "$vtuber_dir" ]; then
        vtuber_name=$(basename "$vtuber_dir")
        avatar_path="$vtuber_dir/avatar.png"
        
        if [ -f "$avatar_path" ]; then
            echo "✅ $vtuber_name のアバター画像が存在します"
        else
            echo "❌ $vtuber_name のアバター画像が見つかりません: $avatar_path"
        fi
    fi
done

# 画像の総数を表示
total_images=$(find "$VTUBERS_DIR" -name "avatar.png" | wc -l)
echo "総アバター画像数: $total_images"