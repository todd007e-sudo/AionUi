import os
import shutil
import argparse
from pathlib import Path

# Configuration: Mapping extensions to folder names
# 配置：扩展名到文件夹名称的映射
FILE_CATEGORIES = {
    'Images': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff'],
    'Videos': ['.mp4', '.mkv', '.mov', '.avi', '.wmv', '.flv'],
    'Audio': ['.mp3', '.wav', '.flac', '.m4a', '.aac', '.ogg'],
    'Documents': ['.pdf', '.docx', '.doc', '.txt', '.xlsx', '.xls', '.pptx', '.ppt', '.csv', '.md'],
    'Archives': ['.zip', '.tar', '.gz', '.rar', '.7z'],
    'Scripts': ['.py', '.sh', '.js', '.html', '.css'],
}

def organize_files(target_dir, dry_run=False):
    target_path = Path(target_dir)

    if not target_path.exists():
        print(f"Error: Directory '{target_dir}' does not exist.")
        return

    print(f"{' [DRY RUN] ' if dry_run else ''}Organizing files in: {target_path.absolute()}")

    # Iterate through all files in the directory
    for item in target_path.iterdir():
        # Skip directories
        if item.is_dir():
            continue

        # Skip the script itself if it's in the same directory
        if item.name == 'foreman_organizer.py':
            continue

        file_ext = item.suffix.lower()
        moved = False

        for category, extensions in FILE_CATEGORIES.items():
            if file_ext in extensions:
                dest_dir = target_path / category

                if not dry_run:
                    dest_dir.mkdir(exist_ok=True)

                dest_path = dest_dir / item.name

                # Handle filename collisions
                if dest_path.exists():
                    print(f"Skipping {item.name}: already exists in {category}")
                else:
                    if dry_run:
                        print(f"[DRY RUN] Would move: {item.name} -> {category}/")
                    else:
                        print(f"Moving: {item.name} -> {category}/")
                        shutil.move(str(item), str(dest_path))

                moved = True
                break

        if not moved and file_ext:
            # Optional: Move unknown files to an 'Others' folder
            dest_dir = target_path / 'Others'
            if not dry_run:
                dest_dir.mkdir(exist_ok=True)

            dest_path = dest_dir / item.name
            if not dest_path.exists():
                if dry_run:
                    print(f"[DRY RUN] Would move: {item.name} -> Others/")
                else:
                    print(f"Moving: {item.name} -> Others/")
                    shutil.move(str(item), str(dest_path))

def main():
    parser = argparse.ArgumentParser(description='The Foreman: File Organizer for Main Event S21')
    parser.add_argument('directory', nargs='?', default='.', help='Directory to organize (default: current directory)')
    parser.add_argument('--run', action='store_true', help='Execute the moves (without this, it defaults to dry run)')

    args = parser.parse_args()

    # By default we do a dry run unless --run is specified
    is_dry_run = not args.run

    if is_dry_run:
        print("NOTE: Running in DRY RUN mode. No files will be moved.")
        print("To actually move files, use: python foreman_organizer.py --run")
        print("-" * 50)

    organize_files(args.directory, dry_run=is_dry_run)

if __name__ == "__main__":
    main()
