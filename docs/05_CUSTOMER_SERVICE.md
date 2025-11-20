# 고객 서비스 시스템

## 1. 고객센터 운영

### 1.1 운영 채널

#### 1.1.1 채널별 운영 계획

| 채널              | 운영시간         | 평균 응답시간 | 담당 인원 | 우선순위 |
| ----------------- | ---------------- | ------------- | --------- | -------- |
| **전화**          | 평일 09:00-18:00 | 즉시          | 2명       | 높음     |
| **카카오톡 채널** | 평일 09:00-18:00 | 5분 이내      | 2명       | 높음     |
| **이메일**        | 24/7 접수        | 24시간 이내   | 1명       | 중간     |
| **1:1 문의**      | 24/7 접수        | 24시간 이내   | 1명       | 중간     |
| **라이브 챗봇**   | 24/7             | 즉시          | 자동화    | 낮음     |

### 1.2 고객 문의 시스템

#### 1.2.1 문의 테이블 설계

```sql
CREATE TABLE support_tickets (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    ticket_number VARCHAR(20) NOT NULL UNIQUE COMMENT 'CS-20250101-001',

    -- 문의자 정보
    user_id BIGINT UNSIGNED NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),

    -- 문의 내용
    category ENUM(
        'order', 'payment', 'shipping', 'return',
        'product', 'account', 'other'
    ) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    attachments JSON COMMENT '첨부 파일 URL 목록',

    -- 주문 관련 (선택)
    order_id BIGINT UNSIGNED NULL,

    -- 처리 상태
    status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',

    -- 담당자
    assigned_to BIGINT UNSIGNED NULL COMMENT '담당 관리자 ID',
    assigned_at TIMESTAMP NULL,

    -- 처리
    resolved_at TIMESTAMP NULL,
    resolution_note TEXT,

    -- 평가
    satisfaction_rating INT NULL COMMENT '1-5',

    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES admins(id) ON DELETE SET NULL,
    INDEX idx_ticket_number (ticket_number),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_user_id (user_id)
);

CREATE TABLE support_ticket_replies (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    ticket_id BIGINT UNSIGNED NOT NULL,

    -- 작성자 (관리자 또는 고객)
    user_id BIGINT UNSIGNED NULL,
    admin_id BIGINT UNSIGNED NULL,

    message TEXT NOT NULL,
    attachments JSON,

    -- 내부 메모 (고객에게 비공개)
    is_internal BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL,
    INDEX idx_ticket_id (ticket_id)
);
```

#### 1.2.2 문의 등록 페이지

```tsx
// resources/js/Pages/Support/Create.tsx
export default function SupportCreate({ categories, order = null }) {
    const { data, setData, post, processing } = useForm({
        category: order ? "order" : "",
        order_id: order?.id || null,
        subject: "",
        message: "",
        attachments: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("support.store"));
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">1:1 문의하기</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 문의 유형 */}
                <div>
                    <Label htmlFor="category">문의 유형</Label>
                    <Select
                        value={data.category}
                        onValueChange={(value) => setData("category", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="문의 유형을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="order">주문/결제</SelectItem>
                            <SelectItem value="shipping">배송</SelectItem>
                            <SelectItem value="return">반품/교환</SelectItem>
                            <SelectItem value="product">상품</SelectItem>
                            <SelectItem value="account">회원정보</SelectItem>
                            <SelectItem value="other">기타</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 주문 번호 (주문 관련 문의 시) */}
                {data.category === "order" && !order && (
                    <div>
                        <Label htmlFor="order_number">주문번호</Label>
                        <Input
                            id="order_number"
                            placeholder="예: ORD-20250101-001"
                            onChange={(e) =>
                                setData("order_number", e.target.value)
                            }
                        />
                    </div>
                )}

                {/* 제목 */}
                <div>
                    <Label htmlFor="subject">제목</Label>
                    <Input
                        id="subject"
                        value={data.subject}
                        onChange={(e) => setData("subject", e.target.value)}
                        placeholder="문의 제목을 입력하세요"
                        required
                    />
                </div>

                {/* 내용 */}
                <div>
                    <Label htmlFor="message">문의 내용</Label>
                    <Textarea
                        id="message"
                        value={data.message}
                        onChange={(e) => setData("message", e.target.value)}
                        rows={8}
                        placeholder="문의 내용을 상세히 입력해주세요"
                        required
                    />
                </div>

                {/* 파일 첨부 */}
                <div>
                    <Label htmlFor="attachments">첨부 파일 (선택)</Label>
                    <Input
                        id="attachments"
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={(e) =>
                            setData("attachments", Array.from(e.target.files))
                        }
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        이미지, PDF 파일만 가능 (최대 5개, 각 10MB 이하)
                    </p>
                </div>

                <Button type="submit" disabled={processing} className="w-full">
                    문의 등록
                </Button>
            </form>
        </div>
    );
}
```

#### 1.2.3 문의 상세 페이지

```tsx
// resources/js/Pages/Support/Show.tsx
export default function SupportShow({ ticket, replies }) {
    const [replyMessage, setReplyMessage] = useState("");

    const handleReply = () => {
        router.post(
            route("support.reply", ticket.id),
            {
                message: replyMessage,
            },
            {
                onSuccess: () => setReplyMessage(""),
            }
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* 문의 정보 */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <Badge variant={getStatusVariant(ticket.status)}>
                                {getStatusLabel(ticket.status)}
                            </Badge>
                            <h1 className="text-2xl font-bold mt-2">
                                {ticket.subject}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                문의번호: {ticket.ticketNumber} |{" "}
                                {formatDateTime(ticket.createdAt)}
                            </p>
                        </div>
                        <Badge variant="outline">
                            {getCategoryLabel(ticket.category)}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="prose max-w-none">{ticket.message}</div>

                    {/* 첨부 파일 */}
                    {ticket.attachments?.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">첨부 파일</h3>
                            <div className="flex gap-2">
                                {ticket.attachments.map((file, index) => (
                                    <a
                                        key={index}
                                        href={file.url}
                                        target="_blank"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {file.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 관련 주문 */}
                    {ticket.order && (
                        <div className="mt-4 p-4 bg-gray-50 rounded">
                            <h3 className="font-semibold mb-2">관련 주문</h3>
                            <Link
                                href={route("orders.show", ticket.order.id)}
                                className="text-blue-600 hover:underline"
                            >
                                주문번호: {ticket.order.orderNumber}
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 답변 목록 */}
            <div className="space-y-4 mb-6">
                {replies.map((reply) => (
                    <Card key={reply.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {reply.adminId ? (
                                        <>
                                            <Badge variant="secondary">
                                                관리자
                                            </Badge>
                                            <span className="font-semibold">
                                                {reply.admin.name}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="font-semibold">
                                            {reply.user.name}
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm text-gray-500">
                                    {formatDateTime(reply.createdAt)}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="prose max-w-none">
                                {reply.message}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* 답변 작성 (문의가 열려있는 경우만) */}
            {ticket.status !== "closed" && (
                <Card>
                    <CardHeader>
                        <h3 className="font-semibold">답변 작성</h3>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            rows={4}
                            placeholder="추가 문의사항을 입력하세요"
                        />
                        <Button onClick={handleReply} className="mt-4">
                            답변 등록
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
```

### 1.3 카카오톡 채널 연동

```php
// app/Services/KakaoTalkService.php
class KakaoTalkService
{
    public function sendMessage(string $phoneNumber, string $templateCode, array $params): void
    {
        // 카카오 알림톡 API 연동
        Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.kakao.api_key'),
        ])->post('https://api.kakao.com/v2/api/talk/memo/default/send', [
            'template_object' => [
                'object_type' => 'text',
                'text' => $this->buildMessage($templateCode, $params),
                'link' => [
                    'web_url' => $params['url'] ?? null,
                ],
            ],
        ]);
    }

    private function buildMessage(string $templateCode, array $params): string
    {
        $templates = [
            'order_confirmed' => "[Dr.Smile] 주문이 완료되었습니다.\n주문번호: {order_number}\n주문금액: {total_amount}원",
            'shipping_started' => "[Dr.Smile] 상품이 발송되었습니다.\n송장번호: {tracking_number}\n택배사: {carrier_name}",
            'inquiry_received' => "[Dr.Smile] 문의가 접수되었습니다.\n문의번호: {ticket_number}\n빠른 시일 내에 답변드리겠습니다.",
        ];

        $message = $templates[$templateCode] ?? '';

        foreach ($params as $key => $value) {
            $message = str_replace("{{$key}}", $value, $message);
        }

        return $message;
    }
}
```

### 1.4 AI 챗봇 (라이브챗)

```tsx
// resources/js/Components/Chatbot.tsx
export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "bot",
            content:
                "안녕하세요! Dr.Smile 고객센터입니다. 무엇을 도와드릴까요?",
        },
    ]);
    const [inputMessage, setInputMessage] = useState("");

    const quickReplies = ["배송 조회", "반품/교환", "결제 문의", "상담원 연결"];

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        // 사용자 메시지 추가
        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: inputMessage,
            },
        ]);

        // 봇 응답 (API 호출)
        const response = await fetch("/api/chatbot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: inputMessage }),
        });

        const data = await response.json();

        setMessages((prev) => [
            ...prev,
            {
                role: "bot",
                content: data.response,
            },
        ]);

        setInputMessage("");
    };

    return (
        <>
            {/* 챗봇 버튼 */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
            >
                <MessageCircle />
            </Button>

            {/* 챗봇 창 */}
            {isOpen && (
                <Card className="fixed bottom-24 right-6 w-96 h-[500px] shadow-2xl flex flex-col">
                    <CardHeader className="border-b">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold">Dr.Smile 고객센터</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-4">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        msg.role === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-lg ${
                                            msg.role === "user"
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-100"
                                        }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 빠른 답변 */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            {quickReplies.map((reply) => (
                                <Button
                                    key={reply}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setInputMessage(reply)}
                                >
                                    {reply}
                                </Button>
                            ))}
                        </div>
                    </CardContent>

                    <CardFooter className="border-t p-4">
                        <div className="flex gap-2 w-full">
                            <Input
                                value={inputMessage}
                                onChange={(e) =>
                                    setInputMessage(e.target.value)
                                }
                                onKeyPress={(e) =>
                                    e.key === "Enter" && handleSendMessage()
                                }
                                placeholder="메시지를 입력하세요"
                            />
                            <Button onClick={handleSendMessage}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            )}
        </>
    );
}
```

## 2. 교환/환불 정책

### 2.1 교환/환불 정책

#### 2.1.1 정책 내용

**교환/환불 가능 기간**: 상품 수령일로부터 7일 이내

**교환/환불 가능 사유**:

-   상품 하자 또는 오배송
-   상품 설명과 다른 경우
-   단순 변심 (미개봉, 미사용 시)

**교환/환불 불가 사유**:

-   상품을 사용 또는 훼손한 경우
-   시간이 경과하여 재판매가 곤란한 경우
-   포장을 개봉하여 상품 가치가 현저히 감소한 경우
-   복제 가능한 상품의 포장을 훼손한 경우

**배송비 부담**:

-   상품 하자/오배송: 판매자 부담
-   단순 변심: 고객 부담 (왕복 6,000원)

#### 2.1.2 반품/교환 페이지

```tsx
// resources/js/Pages/Orders/Return.tsx
export default function OrderReturn({ order }) {
    const { data, setData, post } = useForm({
        order_id: order.id,
        items: [],
        reason: "",
        reason_detail: "",
        refund_method: "original", // original, point, bank
        bank_info: null,
    });

    const reasons = [
        { value: "defective", label: "상품 하자" },
        { value: "wrong_item", label: "오배송" },
        { value: "size_mismatch", label: "사이즈/색상 불일치" },
        { value: "change_of_mind", label: "단순 변심" },
        { value: "other", label: "기타" },
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">반품/교환 신청</h1>

            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-xl font-semibold">주문 정보</h2>
                </CardHeader>
                <CardContent>
                    <p>주문번호: {order.orderNumber}</p>
                    <p>주문일자: {formatDate(order.createdAt)}</p>
                </CardContent>
            </Card>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    post(route("orders.return.store"));
                }}
            >
                {/* 반품 상품 선택 */}
                <Card className="mb-6">
                    <CardHeader>
                        <h2 className="text-xl font-semibold">
                            반품 상품 선택
                        </h2>
                    </CardHeader>
                    <CardContent>
                        {order.items.map((item) => (
                            <label
                                key={item.id}
                                className="flex items-center gap-4 p-4 border rounded mb-2"
                            >
                                <Checkbox
                                    checked={data.items.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setData("items", [
                                                ...data.items,
                                                item.id,
                                            ]);
                                        } else {
                                            setData(
                                                "items",
                                                data.items.filter(
                                                    (id) => id !== item.id
                                                )
                                            );
                                        }
                                    }}
                                />
                                <img
                                    src={item.product.thumbnailImage.url}
                                    alt={item.product.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold">
                                        {item.product.name}
                                    </p>
                                    <p className="text-gray-600">
                                        수량: {item.quantity}개
                                    </p>
                                    <p className="font-bold">
                                        {formatPrice(item.price)}원
                                    </p>
                                </div>
                            </label>
                        ))}
                    </CardContent>
                </Card>

                {/* 반품 사유 */}
                <Card className="mb-6">
                    <CardHeader>
                        <h2 className="text-xl font-semibold">반품 사유</h2>
                    </CardHeader>
                    <CardContent>
                        <Select
                            value={data.reason}
                            onValueChange={(value) => setData("reason", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="사유를 선택하세요" />
                            </SelectTrigger>
                            <SelectContent>
                                {reasons.map((reason) => (
                                    <SelectItem
                                        key={reason.value}
                                        value={reason.value}
                                    >
                                        {reason.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Textarea
                            value={data.reason_detail}
                            onChange={(e) =>
                                setData("reason_detail", e.target.value)
                            }
                            className="mt-4"
                            rows={4}
                            placeholder="상세 사유를 입력해주세요"
                        />
                    </CardContent>
                </Card>

                {/* 환불 방법 */}
                <Card className="mb-6">
                    <CardHeader>
                        <h2 className="text-xl font-semibold">환불 방법</h2>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            value={data.refund_method}
                            onValueChange={(value) =>
                                setData("refund_method", value)
                            }
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value="original"
                                    id="original"
                                />
                                <Label htmlFor="original">
                                    원결제 수단으로 환불
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="point" id="point" />
                                <Label htmlFor="point">포인트로 환불</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="bank" id="bank" />
                                <Label htmlFor="bank">계좌 이체</Label>
                            </div>
                        </RadioGroup>

                        {data.refund_method === "bank" && (
                            <div className="mt-4 space-y-4">
                                <Input
                                    placeholder="은행명"
                                    onChange={(e) =>
                                        setData("bank_info", {
                                            ...data.bank_info,
                                            bank_name: e.target.value,
                                        })
                                    }
                                />
                                <Input
                                    placeholder="계좌번호"
                                    onChange={(e) =>
                                        setData("bank_info", {
                                            ...data.bank_info,
                                            account_number: e.target.value,
                                        })
                                    }
                                />
                                <Input
                                    placeholder="예금주"
                                    onChange={(e) =>
                                        setData("bank_info", {
                                            ...data.bank_info,
                                            account_holder: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>환불 안내</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc ml-4 mt-2">
                            <li>반품 상품 수거 확인 후 환불이 진행됩니다.</li>
                            <li>환불은 영업일 기준 3-5일 소요됩니다.</li>
                            <li>
                                단순 변심의 경우 왕복 배송비(6,000원)가
                                차감됩니다.
                            </li>
                        </ul>
                    </AlertDescription>
                </Alert>

                <Button type="submit" className="w-full">
                    반품 신청
                </Button>
            </form>
        </div>
    );
}
```

### 2.2 반품/교환 관리 시스템

```sql
CREATE TABLE order_returns (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    return_number VARCHAR(30) NOT NULL UNIQUE COMMENT 'RTN-20250101-001',
    order_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,

    -- 반품 유형
    type ENUM('return', 'exchange') NOT NULL,

    -- 반품 상품 (JSON)
    items JSON NOT NULL COMMENT '[{"order_item_id": 1, "quantity": 2, "reason": "..."}]',

    -- 사유
    reason ENUM('defective', 'wrong_item', 'size_mismatch', 'change_of_mind', 'other') NOT NULL,
    reason_detail TEXT,
    photos JSON COMMENT '사진 증빙',

    -- 환불 정보
    refund_method ENUM('original', 'point', 'bank') NOT NULL,
    refund_amount DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0 COMMENT '차감될 배송비',
    bank_info JSON COMMENT '계좌 환불 시 은행 정보',

    -- 수거 정보
    pickup_carrier VARCHAR(50),
    pickup_tracking_number VARCHAR(50),
    pickup_status ENUM('pending', 'picked_up', 'received', 'inspected') DEFAULT 'pending',

    -- 처리 상태
    status ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',

    approved_at TIMESTAMP NULL,
    approved_by BIGINT UNSIGNED NULL,
    rejection_reason TEXT,

    refunded_at TIMESTAMP NULL,

    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES admins(id),
    INDEX idx_return_number (return_number),
    INDEX idx_status (status)
);
```

## 3. FAQ 페이지

### 3.1 FAQ 데이터베이스

```sql
CREATE TABLE faqs (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(50) NOT NULL,
    question VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,

    -- 우선순위 (높을수록 상단 노출)
    display_order INT DEFAULT 0,

    -- 조회수
    view_count INT DEFAULT 0,

    -- 도움 여부
    helpful_count INT DEFAULT 0,
    not_helpful_count INT DEFAULT 0,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    INDEX idx_category (category),
    INDEX idx_display_order (display_order),
    INDEX idx_is_active (is_active)
);
```

### 3.2 FAQ 콘텐츠

```php
// database/seeders/FaqSeeder.php
$faqs = [
    // 주문/결제
    [
        'category' => 'order',
        'question' => '주문 취소는 어떻게 하나요?',
        'answer' => '배송 준비 중 상태 이전까지는 마이페이지 > 주문내역에서 직접 취소 가능합니다. 배송이 시작된 후에는 고객센터로 문의해주세요.',
    ],
    [
        'category' => 'order',
        'question' => '무통장 입금은 얼마나 기다려야 하나요?',
        'answer' => '무통장 입금 선택 시 주문 후 3일 이내에 입금해주셔야 합니다. 기한 내 미입금 시 자동으로 주문이 취소됩니다.',
    ],

    // 배송
    [
        'category' => 'shipping',
        'question' => '배송은 얼마나 걸리나요?',
        'answer' => '결제 완료 후 1-2일 내 발송되며, 발송 후 평균 2-3일 소요됩니다. 도서산간 지역은 1-2일 추가 소요될 수 있습니다.',
    ],
    [
        'category' => 'shipping',
        'question' => '배송지 변경이 가능한가요?',
        'answer' => '배송 준비 중 상태까지는 고객센터로 연락주시면 변경 가능합니다. 배송이 시작된 후에는 택배사를 통해 변경해주세요.',
    ],

    // 반품/교환
    [
        'category' => 'return',
        'question' => '반품 배송비는 누가 부담하나요?',
        'answer' => '상품 하자나 오배송의 경우 당사가 부담합니다. 단순 변심의 경우 고객님께서 왕복 배송비(6,000원)를 부담하셔야 합니다.',
    ],
    [
        'category' => 'return',
        'question' => '교환은 어떻게 진행되나요?',
        'answer' => '교환은 반품 후 재주문 방식으로 진행됩니다. 빠른 배송을 위해 반품 신청과 동시에 원하시는 상품을 재주문해주세요.',
    ],

    // 회원/포인트
    [
        'category' => 'account',
        'question' => '포인트 유효기간이 있나요?',
        'answer' => '포인트는 적립일로부터 1년간 유효합니다. 유효기간이 지나면 자동 소멸됩니다.',
    ],
    [
        'category' => 'account',
        'question' => '회원 탈퇴 후 재가입이 가능한가요?',
        'answer' => '탈퇴 즉시 재가입이 가능합니다. 단, 기존 포인트 및 쿠폰은 복구되지 않습니다.',
    ],

    // 상품
    [
        'category' => 'product',
        'question' => '재입고 알림을 받고 싶어요.',
        'answer' => '품절 상품 페이지에서 "재입고 알림 신청" 버튼을 클릭하시면 재입고 시 이메일로 알림을 보내드립니다.',
    ],
];
```

### 3.3 FAQ 페이지

```tsx
// resources/js/Pages/Faq/Index.tsx
export default function FaqIndex({ faqs }) {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const categories = [
        { value: "all", label: "전체" },
        { value: "order", label: "주문/결제" },
        { value: "shipping", label: "배송" },
        { value: "return", label: "반품/교환" },
        { value: "account", label: "회원/포인트" },
        { value: "product", label: "상품" },
    ];

    const filteredFaqs = faqs.filter((faq) => {
        const matchesCategory =
            selectedCategory === "all" || faq.category === selectedCategory;
        const matchesSearch =
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">자주 묻는 질문 (FAQ)</h1>

            {/* 검색 */}
            <div className="mb-6">
                <Input
                    type="search"
                    placeholder="질문을 검색하세요"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                />
            </div>

            {/* 카테고리 탭 */}
            <Tabs
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                className="mb-6"
            >
                <TabsList>
                    {categories.map((category) => (
                        <TabsTrigger
                            key={category.value}
                            value={category.value}
                        >
                            {category.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {/* FAQ 목록 */}
            <Accordion type="single" collapsible className="space-y-2">
                {filteredFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
                        <AccordionTrigger className="text-left">
                            <div className="flex items-start gap-2">
                                <Badge variant="outline">
                                    {getCategoryLabel(faq.category)}
                                </Badge>
                                <span>{faq.question}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="prose max-w-none">{faq.answer}</div>

                            {/* 도움 여부 */}
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                    이 답변이 도움이 되었나요?
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markHelpful(faq.id, true)}
                                >
                                    👍 도움됨 ({faq.helpfulCount})
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markHelpful(faq.id, false)}
                                >
                                    👎 아니요
                                </Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            {/* 문의하기 CTA */}
            <Card className="mt-8 p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">
                    원하는 답변을 찾지 못하셨나요?
                </h3>
                <p className="text-gray-600 mb-4">
                    고객센터를 통해 문의하시면 빠르게 도와드리겠습니다.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button asChild>
                        <Link href={route("support.create")}>1:1 문의하기</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <a href="tel:1588-0000">전화 문의</a>
                    </Button>
                </div>
            </Card>
        </div>
    );
}
```

## 4. 리뷰 관리 시스템

### 4.1 리뷰 작성 인센티브

```php
// 구매 확정 후 리뷰 작성 요청 이메일 자동 발송
event(new OrderDelivered($order));

// app/Listeners/RequestReview.php
class RequestReview
{
    public function handle(OrderDelivered $event)
    {
        $order = $event->order;

        // 배송 완료 3일 후 리뷰 작성 요청
        Mail::to($order->user)->later(now()->addDays(3), new ReviewRequestMail($order));
    }
}
```

### 4.2 리뷰 관리 대시보드 (관리자)

```tsx
// resources/js/Pages/Admin/Reviews/Index.tsx
export default function AdminReviews({ reviews }) {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">리뷰 관리</h1>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>상품</TableHead>
                        <TableHead>작성자</TableHead>
                        <TableHead>평점</TableHead>
                        <TableHead>내용</TableHead>
                        <TableHead>작성일</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>액션</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reviews.map((review) => (
                        <TableRow key={review.id}>
                            <TableCell>{review.product.name}</TableCell>
                            <TableCell>{review.user.name}</TableCell>
                            <TableCell>
                                <Rating value={review.rating} readonly />
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                                {review.content}
                            </TableCell>
                            <TableCell>
                                {formatDate(review.createdAt)}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={getStatusVariant(review.status)}
                                >
                                    {getStatusLabel(review.status)}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {review.status === "pending" && (
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                approveReview(review.id)
                                            }
                                        >
                                            승인
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                rejectReview(review.id)
                                            }
                                        >
                                            거부
                                        </Button>
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
```

## 5. 구현 체크리스트

### Phase 1: 기본 고객 서비스

-   [ ] 1:1 문의 시스템
-   [ ] FAQ 페이지
-   [ ] 고객센터 연락처 안내
-   [ ] 이메일 문의 시스템

### Phase 2: 반품/교환

-   [ ] 반품/교환 신청 페이지
-   [ ] 반품 관리 시스템 (관리자)
-   [ ] 환불 처리 자동화
-   [ ] 배송비 계산 로직

### Phase 3: 고급 기능

-   [ ] 카카오톡 채널 연동
-   [ ] AI 챗봇 구현
-   [ ] 전화 상담 시스템
-   [ ] 리뷰 관리 및 인센티브

### Phase 4: 최적화

-   [ ] 응답 시간 모니터링
-   [ ] 고객 만족도 조사
-   [ ] 자주 묻는 질문 자동 업데이트
-   [ ] 상담원 성과 분석

---

**최종 업데이트**: 2025-11-20
**담당자**: Customer Service Team
**상태**: Planning
