import { useState } from 'react';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { ProductFormProps } from './types';
import { Image as ImageIcon, Upload, X } from 'lucide-react';

export default function ImageSection({
    data,
    setData,
    errors,
}: Omit<ProductFormProps, 'categories' | 'features' | 'targetAudiences'>) {
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('thumbnail', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const currentImages = data.product_images || [];
        const newImages = [...currentImages, ...files].slice(0, 10);

        setData('product_images', newImages);

        // 프리뷰 생성
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        const currentImages = data.product_images || [];
        setData(
            'product_images',
            currentImages.filter((_, i) => i !== index)
        );
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const removeThumbnail = () => {
        setData('thumbnail', null);
        setThumbnailPreview(null);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    이미지 관리
                </h3>
                <p className="text-sm text-gray-500">
                    상품 이미지를 업로드해주세요. (썸네일 1개 필수, 상세 이미지 최대 10개)
                </p>
            </div>

            {/* 썸네일 이미지 */}
            <div className="border rounded-lg p-4 space-y-4">
                <div>
                    <h4 className="font-medium text-sm text-gray-700">
                        썸네일 이미지 <span className="text-red-500">*</span>
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                        대표 이미지 (권장: 800x800px, 최대 2MB, JPG/PNG/WebP)
                    </p>
                </div>

                <div className="flex items-start gap-4">
                    {thumbnailPreview && (
                        <div className="relative group">
                            <img
                                src={thumbnailPreview}
                                alt="Thumbnail preview"
                                className="w-40 h-40 object-cover rounded-lg border"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={removeThumbnail}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    <div className="flex-1">
                        <Label
                            htmlFor="thumbnail"
                            className="cursor-pointer border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
                        >
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-600">
                                클릭하여 썸네일 업로드
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                                또는 파일을 드래그하세요
                            </span>
                            <input
                                id="thumbnail"
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                                className="hidden"
                            />
                        </Label>
                    </div>
                </div>
                {errors.thumbnail && (
                    <p className="text-sm text-red-600">{errors.thumbnail}</p>
                )}
            </div>

            {/* 상세 이미지 */}
            <div className="border rounded-lg p-4 space-y-4">
                <div>
                    <h4 className="font-medium text-sm text-gray-700">상세 이미지</h4>
                    <p className="text-xs text-gray-500 mt-1">
                        추가 이미지 (권장: 1200x1200px, 최대 5MB/개, 최대 10개)
                    </p>
                </div>

                {/* 이미지 프리뷰 그리드 */}
                {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                                    onClick={() => removeImage(index)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                                <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                    {index + 1}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* 업로드 버튼 */}
                {(data.product_images?.length || 0) < 10 && (
                    <Label
                        htmlFor="product_images"
                        className="cursor-pointer border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
                    >
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                            클릭하여 이미지 추가 ({data.product_images?.length || 0}/10)
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                            여러 파일 선택 가능
                        </span>
                        <input
                            id="product_images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImagesChange}
                            className="hidden"
                        />
                    </Label>
                )}

                {errors.product_images && (
                    <p className="text-sm text-red-600">{errors.product_images}</p>
                )}
            </div>

            {/* 이미지 가이드라인 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="text-sm font-medium text-blue-900 mb-2">
                    이미지 업로드 가이드
                </h5>
                <ul className="text-xs text-blue-800 space-y-1">
                    <li>• 썸네일: 800x800px 정사각형, 흰색 배경 권장</li>
                    <li>• 상세 이미지: 1200x1200px 이상 고해상도</li>
                    <li>• 상품이 화면의 80% 차지하도록 촬영</li>
                    <li>• 여러 각도, 실제 사용 예시, 성분 표시 이미지 포함 권장</li>
                </ul>
            </div>
        </div>
    );
}
