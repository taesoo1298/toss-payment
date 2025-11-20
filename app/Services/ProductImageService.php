<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class ProductImageService
{
    /**
     * 상품 이미지 처리 및 업로드
     *
     * @param  UploadedFile[]  $images
     * @return array
     */
    public function processProductImages(array $images): array
    {
        $processedImages = [];

        foreach ($images as $image) {
            if (!$image instanceof UploadedFile) {
                continue;
            }

            $processedImages[] = $this->processImage($image);
        }

        return $processedImages;
    }

    /**
     * 단일 이미지 처리
     *
     * @param  UploadedFile  $image
     * @return array
     */
    public function processImage(UploadedFile $image): array
    {
        $filename = time().'_'.uniqid().'.'.$image->getClientOriginalExtension();

        // 원본 업로드
        $originalPath = $image->storeAs('products/original', $filename, 'public');

        // 썸네일 생성 (800x800)
        $thumbnailPath = $this->createThumbnail($image, $filename, 800, 800);

        // 중간 크기 생성 (1200x1200)
        $mediumPath = $this->createThumbnail($image, $filename, 1200, 1200, 'medium');

        return [
            'original' => Storage::url($originalPath),
            'thumbnail' => Storage::url($thumbnailPath),
            'medium' => Storage::url($mediumPath),
        ];
    }

    /**
     * 썸네일 생성
     *
     * @param  UploadedFile  $image
     * @param  string  $filename
     * @param  int  $width
     * @param  int  $height
     * @param  string  $folder
     * @return string
     */
    protected function createThumbnail(
        UploadedFile $image,
        string $filename,
        int $width,
        int $height,
        string $folder = 'thumbnails'
    ): string {
        // Note: This requires intervention/image package
        // For now, we'll just store the original image
        // TODO: Install and configure intervention/image for actual image manipulation

        $path = $image->storeAs("products/{$folder}", $filename, 'public');

        return $path;
    }

    /**
     * 썸네일 이미지 업로드
     *
     * @param  UploadedFile  $image
     * @return string
     */
    public function uploadThumbnail(UploadedFile $image): string
    {
        $filename = time().'_'.uniqid().'.'.$image->getClientOriginalExtension();
        $path = $image->storeAs('products/thumbnails', $filename, 'public');

        return Storage::url($path);
    }

    /**
     * 이미지 삭제
     *
     * @param  string  $imageUrl
     * @return bool
     */
    public function deleteImage(string $imageUrl): bool
    {
        // Extract path from URL
        $path = str_replace('/storage/', '', parse_url($imageUrl, PHP_URL_PATH));

        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }

        return false;
    }

    /**
     * 여러 이미지 삭제
     *
     * @param  array  $imageUrls
     * @return void
     */
    public function deleteImages(array $imageUrls): void
    {
        foreach ($imageUrls as $imageUrl) {
            $this->deleteImage($imageUrl);
        }
    }
}
