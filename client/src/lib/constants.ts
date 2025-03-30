// 광역시/도 목록
export const PROVINCES = [
  "서울특별시",
  "경기도",
  "인천광역시",
  "부산광역시",
  "대구광역시",
  "대전광역시",
  "광주광역시",
  "울산광역시",
  "세종특별자치시",
  "강원도",
  "충청북도",
  "충청남도",
  "전라북도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주특별자치도"
];

// 시군구 데이터 (광역시/도별로 구분)
export const DISTRICTS: { [key: string]: string[] } = {
  "서울특별시": [
    "강남구", "강동구", "강북구", "강서구", "관악구", 
    "광진구", "구로구", "금천구", "노원구", "도봉구", 
    "동대문구", "동작구", "마포구", "서대문구", "서초구", 
    "성동구", "성북구", "송파구", "양천구", "영등포구", 
    "용산구", "은평구", "종로구", "중구", "중랑구"
  ],
  "경기도": [
    "고양시", "과천시", "광명시", "광주시", "구리시", 
    "군포시", "김포시", "남양주시", "동두천시", "부천시", 
    "성남시", "수원시", "시흥시", "안산시", "안성시", 
    "안양시", "양주시", "여주시", "오산시", "용인시", 
    "의왕시", "의정부시", "이천시", "파주시", "평택시", 
    "포천시", "하남시", "화성시"
  ],
  "부산광역시": [
    "강서구", "금정구", "남구", "동구", "동래구", 
    "부산진구", "북구", "사상구", "사하구", "서구", 
    "수영구", "연제구", "영도구", "중구", "해운대구"
  ],
  "인천광역시": [
    "계양구", "남동구", "동구", "미추홀구", "부평구", 
    "서구", "연수구", "중구"
  ],
  "대구광역시": [
    "남구", "달서구", "동구", "북구", "서구", 
    "수성구", "중구"
  ],
  "대전광역시": [
    "대덕구", "동구", "서구", "유성구", "중구"
  ],
  "광주광역시": [
    "광산구", "남구", "동구", "북구", "서구"
  ],
  "울산광역시": [
    "남구", "동구", "북구", "중구", "울주군"
  ],
  "세종특별자치시": ["세종시"],
  "강원도": [
    "강릉시", "동해시", "삼척시", "속초시", "원주시", "춘천시",
    "태백시", "고성군", "양구군", "양양군", "영월군", "인제군",
    "정선군", "철원군", "평창군", "홍천군", "화천군", "횡성군"
  ],
  "충청북도": [
    "제천시", "청주시", "충주시", "괴산군", "단양군", "보은군",
    "영동군", "옥천군", "음성군", "증평군", "진천군"
  ],
  "충청남도": [
    "계룡시", "공주시", "논산시", "당진시", "보령시", 
    "서산시", "아산시", "천안시", "금산군", "부여군", 
    "서천군", "예산군", "청양군", "태안군", "홍성군"
  ],
  "전라북도": [
    "군산시", "김제시", "남원시", "익산시", "전주시", "정읍시",
    "고창군", "무주군", "부안군", "순창군", "완주군", "임실군",
    "장수군", "진안군"
  ],
  "전라남도": [
    "광양시", "나주시", "목포시", "순천시", "여수시",
    "강진군", "고흥군", "곡성군", "구례군", "담양군", "무안군",
    "보성군", "신안군", "영광군", "영암군", "완도군", "장성군",
    "장흥군", "진도군", "함평군", "해남군", "화순군"
  ],
  "경상북도": [
    "경산시", "경주시", "구미시", "김천시", "문경시", 
    "상주시", "안동시", "영주시", "영천시", "포항시",
    "고령군", "군위군", "봉화군", "성주군", "영덕군", 
    "영양군", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군"
  ],
  "경상남도": [
    "거제시", "김해시", "밀양시", "사천시", "양산시", 
    "진주시", "창원시", "통영시", "거창군", "고성군", 
    "남해군", "산청군", "의령군", "창녕군", "하동군", "함안군", "함양군", "합천군"
  ],
  "제주특별자치도": ["서귀포시", "제주시"]
};

// 전체 지역 목록을 반환하는 함수 (이전 방식과 호환성 유지)
export const getFullLocationList = (): string[] => {
  return Object.entries(DISTRICTS).flatMap(([province, districts]) => 
    districts.map(district => 
      province === "세종특별자치시" ? "세종시" : `${province.slice(0, 2)} ${district}`
    )
  );
};

// 이전 LOCATIONS 변수 유지 (하위 호환성을 위해)
export const LOCATIONS = getFullLocationList();

// Soccer specializations
export const SPECIALIZATIONS = [
  "개인 레슨",
  "그룹 레슨",
  "팀 코칭",
  "유소년",
  "성인",
  "여성 특화",
  "골키퍼",
  "공격수",
  "수비수",
  "전술 훈련",
  "피지컬",
];

// Lesson durations in minutes
export const LESSON_DURATIONS = [60, 90, 120, 150, 180];

// Group size options
export const GROUP_SIZES = [1, 2, 3, 4, 5, 8, 10, 15, 20];
