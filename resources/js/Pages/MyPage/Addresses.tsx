import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import MyPageLayout from "@/Layouts/MyPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/Components/ui/dialog";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    MapPin,
    Plus,
    Pencil,
    Trash2,
    Home,
    Building,
    CheckCircle2,
} from "lucide-react";
import { useState } from "react";

interface Address {
    id: string;
    name: string;
    recipient: string;
    phone: string;
    postalCode: string;
    address: string;
    addressDetail: string;
    isDefault: boolean;
    type: "home" | "office" | "etc";
}

interface AddressesProps extends PageProps {
    addresses?: Address[];
}

export default function Addresses({ auth, addresses: initialAddresses }: AddressesProps) {
    const user = auth.user!;

    // Mock address data (fallback if backend data is not available)
    const mockAddresses: Address[] = [
        {
            id: "1",
            name: "우리집",
            recipient: "홍길동",
            phone: "010-1234-5678",
            postalCode: "06234",
            address: "서울특별시 강남구 테헤란로 123",
            addressDetail: "456호",
            isDefault: true,
            type: "home",
        },
        {
            id: "2",
            name: "회사",
            recipient: "홍길동",
            phone: "010-1234-5678",
            postalCode: "06789",
            address: "서울특별시 서초구 강남대로 456",
            addressDetail: "7층 701호",
            isDefault: false,
            type: "office",
        },
    ];

    const [addresses, setAddresses] = useState<Address[]>(initialAddresses || mockAddresses);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [formData, setFormData] = useState<Partial<Address>>({
        name: "",
        recipient: user?.name || "",
        phone: "",
        postalCode: "",
        address: "",
        addressDetail: "",
        isDefault: false,
        type: "home",
    });

    const handleOpenDialog = (address?: Address) => {
        if (address) {
            setEditingAddress(address);
            setFormData(address);
        } else {
            setEditingAddress(null);
            setFormData({
                name: "",
                recipient: user?.name || "",
                phone: "",
                postalCode: "",
                address: "",
                addressDetail: "",
                isDefault: addresses.length === 0,
                type: "home",
            });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingAddress(null);
        setFormData({
            name: "",
            recipient: user?.name || "",
            phone: "",
            postalCode: "",
            address: "",
            addressDetail: "",
            isDefault: false,
            type: "home",
        });
    };

    const handleSave = () => {
        if (!formData.name || !formData.recipient || !formData.phone || !formData.address) {
            alert("필수 항목을 모두 입력해주세요.");
            return;
        }

        if (editingAddress) {
            // Update existing address
            setAddresses(prev =>
                prev.map(addr => {
                    if (addr.id === editingAddress.id) {
                        return { ...formData, id: addr.id } as Address;
                    }
                    // If new address is set as default, remove default from others
                    if (formData.isDefault) {
                        return { ...addr, isDefault: false };
                    }
                    return addr;
                })
            );
        } else {
            // Add new address
            const newAddress: Address = {
                ...formData,
                id: Date.now().toString(),
            } as Address;

            if (newAddress.isDefault) {
                setAddresses(prev => [
                    newAddress,
                    ...prev.map(addr => ({ ...addr, isDefault: false })),
                ]);
            } else {
                setAddresses(prev => [...prev, newAddress]);
            }
        }

        handleCloseDialog();
    };

    const handleDelete = (id: string) => {
        if (confirm("이 배송지를 삭제하시겠습니까?")) {
            setAddresses(prev => prev.filter(addr => addr.id !== id));
        }
    };

    const handleSetDefault = (id: string) => {
        setAddresses(prev =>
            prev.map(addr => ({
                ...addr,
                isDefault: addr.id === id,
            }))
        );
    };

    const handleAddressSearch = () => {
        // 주소 검색 API 연동 (예: Daum 우편번호 서비스)
        alert("주소 검색 기능은 별도로 구현해야 합니다.");
    };

    const getTypeIcon = (type: Address["type"]) => {
        switch (type) {
            case "home":
                return <Home className="h-4 w-4" />;
            case "office":
                return <Building className="h-4 w-4" />;
            default:
                return <MapPin className="h-4 w-4" />;
        }
    };

    const getTypeName = (type: Address["type"]) => {
        switch (type) {
            case "home":
                return "집";
            case "office":
                return "회사";
            default:
                return "기타";
        }
    };

    return (
        <>
            <Head title="배송지 관리" />

            <MyPageLayout user={user} currentPage="addresses">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">배송지 관리</h2>
                            <p className="text-muted-foreground">
                                등록된 배송지 {addresses.length}개
                            </p>
                        </div>
                        <Button onClick={() => handleOpenDialog()}>
                            <Plus className="h-4 w-4 mr-2" />
                            배송지 추가
                        </Button>
                    </div>

                    {/* Address List */}
                    {addresses.length === 0 ? (
                        <Card>
                            <CardContent className="py-20">
                                <div className="text-center">
                                    <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                    <p className="text-muted-foreground mb-4">
                                        등록된 배송지가 없습니다
                                    </p>
                                    <Button onClick={() => handleOpenDialog()}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        배송지 추가
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {addresses.map((address) => (
                                <Card
                                    key={address.id}
                                    className={address.isDefault ? "border-primary" : ""}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                {getTypeIcon(address.type)}
                                                <h3 className="font-semibold text-lg">
                                                    {address.name}
                                                </h3>
                                            </div>
                                            {address.isDefault && (
                                                <Badge className="bg-primary">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                    기본 배송지
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="text-sm">
                                                <span className="text-muted-foreground">받는 사람: </span>
                                                <span className="font-medium">{address.recipient}</span>
                                            </div>
                                            <div className="text-sm">
                                                <span className="text-muted-foreground">연락처: </span>
                                                <span className="font-medium">{address.phone}</span>
                                            </div>
                                            <div className="text-sm">
                                                <span className="text-muted-foreground">
                                                    주소:
                                                </span>
                                                <div className="mt-1">
                                                    <div className="font-medium">
                                                        [{address.postalCode}]
                                                    </div>
                                                    <div className="font-medium">
                                                        {address.address}
                                                    </div>
                                                    <div className="font-medium">
                                                        {address.addressDetail}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {!address.isDefault && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => handleSetDefault(address.id)}
                                                >
                                                    기본 배송지 설정
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleOpenDialog(address)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(address.id)}
                                                disabled={address.isDefault && addresses.length > 1}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Help Info */}
                    <Card className="bg-muted/50">
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                배송지 관리 안내
                            </h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>
                                        기본 배송지는 주문 시 자동으로 선택됩니다.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>
                                        배송지는 최대 10개까지 등록할 수 있습니다.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>
                                        기본 배송지가 설정된 상태에서는 해당 배송지를 삭제할 수 없습니다.
                                    </span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Add/Edit Address Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingAddress ? "배송지 수정" : "배송지 추가"}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {/* Address Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    배송지명 <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    placeholder="예: 우리집, 회사"
                                />
                            </div>

                            {/* Address Type */}
                            <div className="space-y-2">
                                <Label>배송지 유형</Label>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant={formData.type === "home" ? "default" : "outline"}
                                        className="flex-1"
                                        onClick={() => setFormData({ ...formData, type: "home" })}
                                    >
                                        <Home className="h-4 w-4 mr-2" />
                                        집
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={formData.type === "office" ? "default" : "outline"}
                                        className="flex-1"
                                        onClick={() => setFormData({ ...formData, type: "office" })}
                                    >
                                        <Building className="h-4 w-4 mr-2" />
                                        회사
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={formData.type === "etc" ? "default" : "outline"}
                                        className="flex-1"
                                        onClick={() => setFormData({ ...formData, type: "etc" })}
                                    >
                                        <MapPin className="h-4 w-4 mr-2" />
                                        기타
                                    </Button>
                                </div>
                            </div>

                            {/* Recipient */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="recipient">
                                        받는 사람 <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="recipient"
                                        value={formData.recipient}
                                        onChange={(e) =>
                                            setFormData({ ...formData, recipient: e.target.value })
                                        }
                                        placeholder="홍길동"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">
                                        연락처 <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({ ...formData, phone: e.target.value })
                                        }
                                        placeholder="010-1234-5678"
                                    />
                                </div>
                            </div>

                            {/* Postal Code */}
                            <div className="space-y-2">
                                <Label htmlFor="postalCode">
                                    우편번호 <span className="text-destructive">*</span>
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="postalCode"
                                        value={formData.postalCode}
                                        onChange={(e) =>
                                            setFormData({ ...formData, postalCode: e.target.value })
                                        }
                                        placeholder="12345"
                                        readOnly
                                    />
                                    <Button type="button" variant="outline" onClick={handleAddressSearch}>
                                        주소 검색
                                    </Button>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <Label htmlFor="address">
                                    주소 <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData({ ...formData, address: e.target.value })
                                    }
                                    placeholder="기본 주소"
                                    readOnly
                                />
                            </div>

                            {/* Address Detail */}
                            <div className="space-y-2">
                                <Label htmlFor="addressDetail">
                                    상세 주소 <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="addressDetail"
                                    value={formData.addressDetail}
                                    onChange={(e) =>
                                        setFormData({ ...formData, addressDetail: e.target.value })
                                    }
                                    placeholder="상세 주소를 입력하세요"
                                />
                            </div>

                            {/* Default Address */}
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="isDefault"
                                    checked={formData.isDefault}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, isDefault: checked as boolean })
                                    }
                                />
                                <Label htmlFor="isDefault" className="cursor-pointer">
                                    기본 배송지로 설정
                                </Label>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={handleCloseDialog}>
                                취소
                            </Button>
                            <Button onClick={handleSave}>
                                {editingAddress ? "수정" : "추가"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </MyPageLayout>
        </>
    );
}
