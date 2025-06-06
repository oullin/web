const IMAGES_DIR = 'images';

export function image(filename: string): string {
	return `/${IMAGES_DIR}/${filename}`;
}
