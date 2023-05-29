---
title: 'React에서 키워드 검색 구현하기'
author: '김명선'
date: 2019-2-1 16:21:13
category: 'front-end'
profile: 'https://refrigerator-image.s3.ap-northeast-2.amazonaws.com/icon/IMG_9707.JPG'
draft: false
---

# 서론

우리 프로젝트는 식재료 검색과 레시피 검색 기능을 제공한다. 식재료 검색 기능은 사용자가 등록한 식재료를 바탕으로, 식재료 이름에 검색 키워드가 포함된 식재료를 결과로 보여준다.

우리는 식재료 검색 과정이 사용자에게 최대한 간단하게 느껴지도록 버튼 클릭과 같은 이벤트를 최소화하고자 했다. 그래서 검색 키워드에 따라 검색 결과가 바로 보여지도록 디자인했다. API를 이용해 이런 검색 방식을 구현하면 API 호출량이 많아 비효율적이었다. 마침, 식재료 검색이 연산이 단순하고 데이터가 많지 않아서, 클라이언트에서 식재료 키워드 검색 기능을 구현하기로 했다.

# 구현

리액트에서 키워드 검색을 효율적으로 구현하기 위해 useMemo를 사용했다.

```jsx
import data from "@/api/ingredientData";

const [keyword, setKeyword] = useState<string>("");
const [ingredients, setIngredients] = useState(data);
```

- `keyword` : 입력되는 검색 키워드
- `ingredients` : 사용자 식재료 전체 배열
    - 데이터 형식  `[{name:…, remainDays:…}, …]`

```jsx
const filteredIngredients = useMemo(() => {
	return ingredients.filter((ingredient) =>
		ingredient.name.includes(keyword),
	);
}, [ingredients, keyword]);
```

- `filteredIngredients` : 검색 키워드를 식재료명에 포함하는 식재료의 배열 (검색 결과)
    - `useMemo` 훅 사용 : 데이터 연산 결과를 캐싱하여 성능을 최적화 → 검색 기능 구현에 적합
    - `filter` 함수 - 데이터 필터링 : `ingredient.name`에 `keyword`가 포함된 경우 `true` 반환
    - 의존성 배열 `[ingredients, keywords]` : 해당 변수가 변경됐을 때 함수 실행

```jsx
<BackLayout>
	...
	{keyword && // 키워드 있으면
		(filteredIngredients.length > 0 ? ( // 검색 결과 있으면
			<IngredientGrid ingredientData={filteredIngredients} /> // 식재료 목록 렌더링
		) : (
			<div>결과 없음</div> // 결과 없음 렌더링
	))}
</BackLayout>
```

- 키워드가 없으면 → 아무것도 렌더링 하지 않음 (코드 없음)
- 키워드가 있고 검색 결과가 있으면 → IngredientGrid 결과 식재료 목록 렌더링
- 키워드가 있고 검색 결과가 없으면 → 결과 없음 렌더링

# 한글 적용 오류 및 해결

위와 같이 구현했을 때, 음절 단위로는 잘 구현됐지만 음운 단위로는 적용되지 않았다. 예를 들어 ‘사’를 입력했을 때 ‘사과’가 잘 뜨지만, ‘ㅅ’을 입력했을 때는 ‘사과’가 뜨지 않았다. 이를 해결하기 위해 검색 키워드와 식재료명을 음운 단위로 쪼개는 과정을 추가하기로 했다.

```jsx
import { disassemble } from "hangul-js";

export default function toPhoneme(word) {
	return disassemble(word).join();
}
```

- `toPhoneme` 함수 선언
    - 한글 문자열 입력시 자음, 모음 분리된 문자열 반환 (‘사과’ → ‘ㅅㅏㄱㅗㅏ’)
    - hangul-js 라이브러리의 `disassemble` 함수 사용

```jsx
useEffect(() => {
	const ingredientsWithPhoneme = data.map((item) => ({
		...item,
		phoneme: toPhoneme(item.name),
	}));
	setIngredients(ingredientsWithPhoneme);
}, []);
```

- `ingredients` 에 `phoneme` 키 추가해서 음운 단위로 쪼갠 식재료명 할당
    - 데이터 형식  `[{name:…, remainDays:…, phoneme:...}, …]`

```jsx
const filteredIngredients = useMemo(() => {
	const keywordPhoneme = toPhoneme(keyword);
	return ingredients.filter((ingredient) =>
		ingredient.phoneme.includes(keywordPhoneme),
	);
}, [ingredients, keyword]);
```

- `keywordPhoneme` : 음운 단위로 자른 검색 키워드
- `keywordPhoneme`과 `ingredient.phoneme` 비교

