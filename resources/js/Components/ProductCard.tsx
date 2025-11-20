import { Card, CardContent, CardFooter } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Product } from "@/types";
import { ShoppingCart, Star } from "lucide-react";
import { Link } from "@inertiajs/react";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("ko-KR", {
            style: "currency",
            currency: "KRW",
        }).format(price);
    };

    const discountPercentage = product.originalPrice
        ? Math.round(
              ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100
          )
        : 0;

    return (
        <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <Link href={`/products/${product.id}`}>
                <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && (
                        <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
                            {product.badge}
                        </div>
                    )}
                    {discountPercentage > 0 && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                            {discountPercentage}% OFF
                        </div>
                    )}
                </div>
            </Link>

            <CardContent className="p-4">
                <Link href={`/products/${product.id}`}>
                    <div className="text-xs text-muted-foreground mb-1">
                        {product.category}
                    </div>
                    <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {product.description}
                    </p>
                </Link>

                {/* Rating */}
                {product.rating && (
                    <div className="flex items-center gap-1 mb-3">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                        i < Math.floor(product.rating!)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                            ({product.reviewCount || 0})
                        </span>
                    </div>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-2">
                    {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                        </span>
                    )}
                    <span className="text-xl font-bold text-primary">
                        {formatPrice(product.price)}
                    </span>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button className="w-full" size="sm">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    장바구니 담기
                </Button>
            </CardFooter>
        </Card>
    );
}
