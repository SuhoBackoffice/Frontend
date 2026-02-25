새로운 페이지를 하나 만들꺼야.
project/[projectId]/material/stock 이야.
이 페이지는 현재 프로젝트에 할당된 자재 목록과 그거에 대한 재고 현황(입고된 수량), 사용 수량 등을 확인할 수 있는 페이지야.
페이지네이션은 적용되어있지 않아.

API 두개로 진행될꺼야.

### 자재 재고 목록 정렬 조건 조회

```
curl -X 'GET' \
  'http://localhost:8080/material/stock/types' \
  -H 'accept: */*'
```

```
{
  "isSuccess": true,
  "code": "200",
  "message": "자재 재고 정렬 조건 조회 성공",
  "data": [
    {
      "sort": "MATERIAL_CODE",
      "description": "도번"
    },
    {
      "sort": "ITEM_NAME",
      "description": "품명"
    },
    {
      "sort": "PLAN_QUANTITY",
      "description": "계획 수량"
    },
    {
      "sort": "INBOUND_QUANTITY",
      "description": "입고 수량"
    },
    {
      "sort": "USED_QUANTITY",
      "description": "사용 수량"
    }
  ]
}
```

### 프로젝트 자재 재고 목록 조회

```
curl -X 'GET' \
  'http://localhost:8080/material/stock/1?sort=MATERIAL_CODE&dir=ASC' \
  -H 'accept: */*'
```

```
{
  "isSuccess": true,
  "code": "200",
  "message": "자재 재고 목록 조회 성공",
  "data": [
    {
      "id": 8,
      "materialCode": "186-0205101-00",
      "itemName": "CABLE COVER",
      "totalPlanQuantity": 0,
      "totalInboundQuantity": 0,
      "totalUsedQuantity": 0,
      "remainingInbound": 0
    },
    {
      "id": 5,
      "materialCode": "ST-3600L",
      "itemName": "[v8.0]Profile 3600L 레일용",
      "totalPlanQuantity": 200,
      "totalInboundQuantity": 30,
      "totalUsedQuantity": 0,
      "remainingInbound": 170
    }
  ]
}
```

sort 는 위에서 받고
keyword 는 없으면 모두 조회
dir 은 ASC, DESC 두개

### 디자인

1. @components/theme/ThemeProvider.tsx 가 적용되어있으므로 블랙/라이트 모드 잘 적용될 것
2. 백그라운드가 색상이 기본적으로 적용되어있으므로 참고 필요 (@app/project/[projectId]/layout.tsx )
3. 현대적인 디자인으로 깔끔하게 진행
4. @lib/hooks/useDebounce.ts 을 활용하여 검색 버튼 없이 keyword 가 변경될때 조회 되도록 진행
5. 최대한 안내의 descrption 잘 넣어줘야함. 가이드 보다는 이 페이지가 어떤걸 의미하는지.

### 바로가기 추가

@app/project/[projectId]/layout.tsx 에 @app/project/[projectId]/\_components/ProjectSidenav.tsx 사이드바가 있는데, 이거에 자재 관리쪽에 추가해줘.
