"""Seed script: reset DB and insert mock data matching the original frontend mock data exactly."""

import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from datetime import datetime
from app.db.database import engine, SessionLocal, Base
from app.models.models import User, Post, Comment, Like, CommentLike
from app.core.security import get_password_hash

def parse_dt(s):
    return datetime.fromisoformat(s.replace("Z", "+00:00"))

# 1) Drop & recreate all tables
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# --- Users (20) ---
# 기존 mockUsers와 완전히 동일한 id, username, email
users_data = [
    {"id": 999,  "username": "admin_manager", "email": "admin@oops.ac.kr",    "password": "password999!",  "is_admin": True},
    {"id": 104,  "username": "user104_tong",   "email": "tong104@example.com", "password": "password104!",  "is_admin": False},
    {"id": 421,  "username": "user421_matzip",  "email": "matzip421@example.com", "password": "password421!", "is_admin": False},
    {"id": 87,   "username": "user87_cse",      "email": "cse87@example.com",    "password": "password87!",   "is_admin": False},
    {"id": 512,  "username": "user512_dev",      "email": "dev512@example.com",   "password": "password512!",  "is_admin": False},
    {"id": 231,  "username": "user231_mohyun",   "email": "mohyun231@example.com", "password": "password231!", "is_admin": False},
    {"id": 302,  "username": "user302_music",    "email": "music302@example.com",  "password": "password302!",  "is_admin": False},
    {"id": 1,    "username": "user1_kim",        "email": "kim1@example.com",     "password": "password1!",    "is_admin": False},
    {"id": 2,    "username": "user2_lee",        "email": "lee2@example.com",     "password": "password2!",    "is_admin": False},
    {"id": 3,    "username": "user3_park",       "email": "park3@example.com",    "password": "password3!",    "is_admin": False},
    {"id": 4,    "username": "user4_choi",       "email": "choi4@example.com",    "password": "password4!",    "is_admin": False},
    {"id": 5,    "username": "user5_jung",       "email": "jung5@example.com",    "password": "password5!",    "is_admin": False},
    {"id": 6,    "username": "user6_kang",       "email": "kang6@example.com",    "password": "password6!",    "is_admin": False},
    {"id": 7,    "username": "user7_cho",        "email": "cho7@example.com",     "password": "password7!",    "is_admin": False},
    {"id": 8,    "username": "user8_yoon",       "email": "yoon8@example.com",    "password": "password8!",    "is_admin": False},
    {"id": 9,    "username": "user9_jang",       "email": "jang9@example.com",    "password": "password9!",    "is_admin": False},
    {"id": 10,   "username": "user10_lim",       "email": "lim10@example.com",    "password": "password10!",   "is_admin": False},
    {"id": 11,   "username": "user11_han",       "email": "han11@example.com",    "password": "password11!",   "is_admin": False},
    {"id": 12,   "username": "user12_oh",        "email": "oh12@example.com",     "password": "password12!",   "is_admin": False},
    {"id": 13,   "username": "user13_seo",       "email": "seo13@example.com",    "password": "password13!",   "is_admin": False},
]

for u in users_data:
    user = User(
        id=u["id"],
        username=u["username"],
        email=u["email"],
        hashed_password=get_password_hash(u["password"]),
        is_admin=u["is_admin"],
    )
    db.add(user)

db.flush()

# --- Posts (31) ---
# category: "notification" → 백엔드에서는 "notice"로 저장
CATEGORY_MAP = {"free": "free", "notification": "notice"}

posts_data = [
    {"id": 0,   "title": "[필독] 2026학년도 통학 게시판 이용 수칙 및 매너 안내", "content": "안녕하세요, 통학 게시판 관리자입니다. 서로 존중하는 커뮤니티를 위해 욕설, 비방, 광고성 글은 제한됩니다. 특히 셔틀버스 줄서기 매너를 지켜주시고, 카풀 모집 시 안전에 유의해 주세요.", "createdAt": "2026-05-16T02:15:22.114Z", "authorId": 999, "viewCount": 2450, "likeCount": 128, "commentCount": 45, "category": "notification"},
    {"id": 1,   "title": "강남역 가는 1150번 버스 주말 배차 시간 아시는 분?", "content": "오늘 주말이라 정류장에서 기다리는데 배차 간격이 평소보다 훨씬 긴 것 같네요ㅠㅠ 혹시 2026년 상반기 변경된 주말 시간표 가지고 계신 분 공유 좀 부탁드립니다!", "createdAt": "2026-05-16T08:30:45.712Z", "authorId": 104, "viewCount": 412, "likeCount": 5, "commentCount": 3, "category": "free"},
    {"id": 2,   "title": "외대 글로벌캠퍼스 정문 앞 새로 생긴 돈까스집 솔직 후기", "content": "이번 주에 오픈한 돈까스집 다녀왔는데 양 진짜 많고 소스가 대박입니다. 가격도 9,000원이라 가성비 최고예요. 점심시간엔 웨이팅 좀 있으니까 1교시 끝나고 바로 가시는 걸 추천!", "createdAt": "2026-05-16T11:12:05.891Z", "authorId": 421, "viewCount": 728, "likeCount": 42, "commentCount": 14, "category": "free"},
    {"id": 3,   "title": "오픈소스공학 조별 과제 같이 하실 분 구합니다 (컴공)", "content": "금요일 3, 4교시 오픈소스공학 수업 듣는 컴퓨터공학과 학생입니다. 리액트나 노드 중에서 한 분야 조금이라도 다뤄보신 분이면 좋을 것 같아요! 열심히 해서 A+ 받아봅시다. 오픈채팅으로 연락주세요.", "createdAt": "2026-05-16T13:45:19.002Z", "authorId": 87, "viewCount": 95, "likeCount": 2, "commentCount": 8, "category": "free"},
    {"id": 4,   "title": "기숙사 야간 배달음식 수령 장소 어디가 제일 편한가요?", "content": "이번에 새로 입사한 신입생인데 보통 밤에 치킨 시키면 어디서 받나요? 정문까지 내려가야 하는지 아니면 기숙사 로비 앞에도 오토바이 들어올 수 있는지 궁금합니다.", "createdAt": "2026-05-16T14:01:34.937Z", "authorId": 512, "viewCount": 320, "likeCount": 11, "commentCount": 21, "category": "free"},
    {"id": 5,   "title": "[공지] 대운동장 잔디 보수 공사로 인한 이용 통제 안내", "content": "시설관리팀에서 알려드립니다. 대운동장 천연잔디 동해 피해 복구 및 보수 공사로 인해 다음 주 월요일부터 금요일까지 대운동장 출입이 전면 통제되오니 학우 여러분의 양해 부탁드립니다.", "createdAt": "2026-05-17T01:05:00.000Z", "authorId": 999, "viewCount": 1520, "likeCount": 34, "commentCount": 5, "category": "notification"},
    {"id": 6,   "title": "모현읍 주변 자취방 원룸 양도하실 분 찾습니다.", "content": "개인 사정으로 이번 학기 휴학하게 되어서 학교 앞 원룸 계약 기간 채우셔야 하거나 급하게 양도하실 분 구합니다. 위치는 정문에서 도보 10분 이내 선호해요. 쪽지 주세요!", "createdAt": "2026-05-15T09:20:11.451Z", "authorId": 231, "viewCount": 184, "likeCount": 0, "commentCount": 1, "category": "free"},
    {"id": 7,   "title": "셔틀버스 광주캠 노선 예약 마감 시간 몇 시까지임?", "content": "맨날 통학버스 앱으로 예약하다가 깜빡했는데 전날 몇 시까지 예약 마감인가요? 지금 들어가니까 예약 버튼이 안 눌려서 조마조마하네요 대중교통 타야 하나요...", "createdAt": "2026-05-16T15:30:22.887Z", "authorId": 231, "viewCount": 290, "likeCount": 4, "commentCount": 12, "category": "free"},
    {"id": 8,   "title": "오늘 학생회관 앞에서 버스킹 하시는 분들 노래 진짜 잘 부르시네요", "content": "공강 시간에 지나가다가 들었는데 음색 대박이네요... 혹시 중앙동아리인가요? 마지막에 부른 인디 곡 제목 아시는 분 있으면 댓글로 알려주시면 감사하겠습니다!", "createdAt": "2026-05-16T12:00:44.123Z", "authorId": 302, "viewCount": 810, "likeCount": 56, "commentCount": 18, "category": "free"},
    {"id": 9,   "title": "[안내] 2026년 1학기 중간 강의평가 실시 안내", "content": "학사지원팀입니다. 교육의 질 향상과 원활한 수업 진행을 위해 2026학년도 제1학기 중간 강의평가를 다음과 같이 실시하오니 학생 여러분은 기한 내에 반드시 참여해 주시기 바랍니다.", "createdAt": "2026-05-14T03:00:00.000Z", "authorId": 999, "viewCount": 3100, "likeCount": 12, "commentCount": 2, "category": "notification"},
    {"id": 10,  "title": "교양 스페인어 입문 과제 마감일이 오늘까지인가요?", "content": "e-campus에 공지가 따로 안 올라온 것 같아서 헷갈리네요. 지난주 수업 때 교수님이 이번 주말까지 레포트 제출하라고 하셨던 기억이 나는데 정확한 시간 아시는 분?", "createdAt": "2026-05-16T16:45:00.000Z", "authorId": 104, "viewCount": 142, "likeCount": 1, "commentCount": 4, "category": "free"},
    {"id": 11,  "title": "생능출판사 운영체제 전공책 중고로 파실 분 계신가요?", "content": "컴공 전공서적인데 이번 학기 실습 때 필요해서 급하게 구합니다. 필기 흔적이나 낙서 많아도 상관없으니 찢어진 곳만 없으면 됩니다! 가격 맞춰드릴 테니 연락주세요.", "createdAt": "2026-05-16T18:12:30.555Z", "authorId": 87, "viewCount": 88, "likeCount": 0, "commentCount": 2, "category": "free"},
    {"id": 12,  "title": "중앙 도서관 노트북 열람실 와이파이 저만 계속 끊기나요?", "content": "오늘 아침부터 과제 하려고 도서관 3층 앉아있는데 5분에 한 번씩 연결이 유실되네요. 제 노트북 문제인지 학교 서버 문제인지 궁금합니다. 다른 분들은 잘 되시나요?", "createdAt": "2026-05-17T02:30:15.000Z", "authorId": 421, "viewCount": 210, "likeCount": 8, "commentCount": 15, "category": "free"},
    {"id": 13,  "title": "[공지] 학내 흡연구역 외 절대 금연 및 과태료 부과 안내", "content": "학생지원팀입니다. 최근 지정된 흡연구역 외 건물의 계단, 옥상, 벤치 등에서의 흡연으로 인한 민원이 다수 발생하고 있습니다. 적발 시 과태료가 부과될 수 있으니 지정 장소를 이용 바랍니다.", "createdAt": "2026-05-13T09:00:00.000Z", "authorId": 999, "viewCount": 1890, "likeCount": 22, "commentCount": 38, "category": "notification"},
    {"id": 14,  "title": "학교 커뮤니티 앱(OOPS) 개발중인데 피드백 좀 해주라", "content": "웹프로그래밍 프로젝트 겸 동아리원들이랑 소소하게 통학러 전용 웹앱 만들고 있거든? 지금 페이지네이션이랑 게시판 정렬 기능까지 붙였는데 UI 검수 좀 도와줄 사람 구함!!", "createdAt": "2026-05-17T03:10:00.000Z", "authorId": 512, "viewCount": 510, "likeCount": 33, "commentCount": 27, "category": "free"},
    {"id": 15,  "title": "정문 앞 서점 토요일에도 영업 하나요?", "content": "교재 분실해서 새로 한 권 사야 하는데 주말에도 문 여는지 모르겠네요. 혹시 사장님 연락처나 주말 영업시간 아시는 학우분 답변 부탁드립니다.", "createdAt": "2026-05-16T05:22:11.000Z", "authorId": 104, "viewCount": 94, "likeCount": 2, "commentCount": 0, "category": "free"},
    {"id": 16,  "title": "이번 학기 학식 메뉴 중에서 직화 제육덮밥 먹어본 사람??", "content": "인문관 식당 새로 리뉴얼되고 나서 직화 라인 생겼길래 먹어봤는데 불맛 대박이고 양도 장난 아니네요. 앞으로 점심은 무조건 여기서 때울 듯요 강추합니다.", "createdAt": "2026-05-16T12:40:59.112Z", "authorId": 421, "viewCount": 602, "likeCount": 19, "commentCount": 11, "category": "free"},
    {"id": 17,  "title": "셔틀버스 증차 요구 서명운동 링크 공유합니다.", "content": "매일 아침 8시 20분 서현역 노선 줄 설 때마다 미어터져서 지각하는 학우분들 많으시죠? 총학생회와 연계하여 대학 본부에 정식 증차 요청을 하기 위한 설문을 진행 중이니 많은 참여 바랍니다.", "createdAt": "2026-05-15T14:22:00.000Z", "authorId": 87, "viewCount": 1120, "likeCount": 95, "commentCount": 42, "category": "free"},
    {"id": 18,  "title": "야간 작업이나 야자하기 좋은 24시 카페 있을까요?", "content": "시험기간은 아니지만 팀플 과제 코딩 양이 너무 많아서 밤새서 작업할 공간이 필요합니다. 학교 근처에 카공하기 좋고 눈치 안 보이는 24시 카페 추천 좀 해주세요.", "createdAt": "2026-05-16T22:19:44.000Z", "authorId": 512, "viewCount": 415, "likeCount": 6, "commentCount": 9, "category": "free"},
    {"id": 19,  "title": "[안내] 2026학년도 하계 글로벌 해외 봉사단 모집 공고", "content": "국제교류팀에서 안내합니다. 다가오는 여름방학 동안 아시아 및 아프리카 지역에서 교육 봉사 및 노력 봉사를 펼칠 참신하고 책임감 있는 해외 봉사단을 집결하오니 많은 지원 바랍니다.", "createdAt": "2026-05-12T02:00:00.000Z", "authorId": 999, "viewCount": 4200, "likeCount": 54, "commentCount": 16, "category": "notification"},
    {"id": 20,  "title": "에어팟 프로2 본체(맥세이프형) 도서관 지하 매점에서 분실", "content": "오늘 오후 4시쯤 지하 매점 테이블에서 음료수 마시다가 두고 내린 것 같습니다. 철제 케이스 끼워져 있고 이름 이니셜 'HM' 각인되어 있어요. 주우신 분 제발 연락 부탁드려요 고기 사드릴게요.", "createdAt": "2026-05-16T19:05:11.231Z", "authorId": 104, "viewCount": 280, "likeCount": 3, "commentCount": 5, "category": "free"},
    {"id": 21,  "title": "컴퓨터공학과 2026년 소모임 연합 엠티 수요조사", "content": "안녕하세요 컴공 학생회 체육부입니다! 다가오는 5월 말 대성리로 예정된 연합 MT 수요조사 폼을 오픈했습니다. 인원 파악 후 버스 대절 및 숙소 예약 예정이니 이번 주까지 꼭 체크해 주세요.", "createdAt": "2026-05-15T11:00:00.000Z", "authorId": 87, "viewCount": 395, "likeCount": 14, "commentCount": 8, "category": "free"},
    {"id": 22,  "title": "정문 코인노래방 서비스 시간 원래 이렇게 혜자임?", "content": "방금 친구랑 5천원 넣고 부르는데 보너스를 계속 주셔가지고 2시간째 못 나가는 중ㅋㅋㅋㅋ 사장님 남는 거 있으신가요? 시설도 깔끔하고 음향 장비 빵빵해서 단골 예약입니다.", "createdAt": "2026-05-16T21:11:00.000Z", "authorId": 421, "viewCount": 520, "likeCount": 22, "commentCount": 7, "category": "free"},
    {"id": 23,  "title": "미시경제학 조교님 연락처 아시는 분 계신가요?", "content": "출결 정정 때문에 메일을 보내야 하는데 강의계획서에 적힌 번호가 없는 번호라고 뜨네요. 혹시 학과사무실 거치지 않고 조교님께 다이렉트로 연락할 수 있는 이메일 아시면 공유 부탁려요.", "createdAt": "2026-05-16T10:05:19.000Z", "authorId": 231, "viewCount": 110, "likeCount": 1, "commentCount": 2, "category": "free"},
    {"id": 24,  "title": "축제 연예인 라인업 찌라시 돌던데 진짜인가요??", "content": "단톡방에 이번 대동제 라인업이라고 이미지 하나 돌고 있는데 아이돌 두 팀에 유명 밴드 섞여 있더라고요. 예산 엄청 썼다는 소문이 있던데 혹시 학생회 패밀리 계시면 스포 좀 해주세요!!", "createdAt": "2026-05-15T17:35:00.000Z", "authorId": 302, "viewCount": 1980, "likeCount": 67, "commentCount": 54, "category": "free"},
    {"id": 25,  "title": "[공지] 교내 노후 엘리베이터 교체 공사 및 운행 중단 안내", "content": "시설안전팀입니다. 학생회관 및 공학관의 노후 승강기 정밀 안전점검 결과에 따라 전면 교체 공사를 실시합니다. 공사 기간 중 계단을 이용해 주시기 바라며 소음이 발생할 수 있으니 양해 바랍니다.", "createdAt": "2026-05-11T09:00:00.000Z", "authorId": 999, "viewCount": 1450, "likeCount": 4, "commentCount": 11, "category": "notification"},
    {"id": 26,  "title": "셔틀버스 카드 단말기 태그 안 될 때 꿀팁 준다", "content": "매번 찍을 때마다 '다시 대주세요' 뜨는 사람 많지? 그거 스마트폰 NFC 기능이 켜져 있어서 카드랑 주파수 간섭 생겨서 그런 거임. 지갑에서 카드 꺼내 찍거나 NFC 완전히 끄면 한 방에 찍힌다.", "createdAt": "2026-05-16T07:15:33.000Z", "authorId": 104, "viewCount": 920, "likeCount": 41, "commentCount": 19, "category": "free"},
    {"id": 27,  "title": "내일 비 많이 온다는데 다들 우산 챙겨라", "content": "기상청 특보 보니까 아침 출근/통학 시간대에 시간당 20mm 이상 장대비 쏟아진다고 함. 다들 신발 젖지 말고 장화 신거나 여벌 양말 챙겨오는 거 추천함. 지각하지 마라 화이팅!", "createdAt": "2026-05-16T23:50:11.000Z", "authorId": 302, "viewCount": 450, "likeCount": 15, "commentCount": 6, "category": "free"},
    {"id": 28,  "title": "공과대학 매점 라면 조리기 도입 대찬성 글", "content": "한강 라면 조리기 공대 지하 매점에 드디어 들어왔네요! 봉지라면 사서 기계에 올리면 타이머 맞춰서 끓여주는데 진짜 PC방 라면 저리가라 수준으로 꼬들꼬들 맛있음ㅋㅋ 다들 꼭 먹어보셈.", "createdAt": "2026-05-16T13:10:00.000Z", "authorId": 512, "viewCount": 630, "likeCount": 28, "commentCount": 13, "category": "free"},
    {"id": 29,  "title": "[안내] 2026-1학기 국가장학금 2차 신청 마감 임박 안내", "content": "장학복지팀입니다. 한국장학재단에서 주관하는 국가장학금 1학기 2차 신청 기간이 이틀 뒤 마감됩니다. 신입생, 편입생, 복학생 중 아직 신청하지 않은 대상자는 서둘러 서류 제출을 완료 바랍니다.", "createdAt": "2026-05-10T04:00:00.000Z", "authorId": 999, "viewCount": 3500, "likeCount": 45, "commentCount": 3, "category": "notification"},
    {"id": 333, "title": "안녕하세요", "content": "기능 확인용 글추가 ", "createdAt": "2026-05-16T02:15:22.114Z", "authorId": 999, "viewCount": 2450, "likeCount": 128, "commentCount": 45, "category": "notification"},
    {"id": 30,  "title": "시험기간 도서관 자리 양보 프로젝트 — 선착순 20명 모집", "content": "매번 시험기간만 되면 도서관 자리가 부족해서 힘드시죠? 이번에 학생회에서 자리 양보 매칭 프로젝트를 기획했습니다. 자리를 양보해주실 분과 자리가 필요하신 분을 매칭해드려요. 공강 시간에 자리를 비우시는 분들이 양보해주시면, 그 시간에 공부할 자리가 필요한 분들이 이용할 수 있습니다.", "createdAt": "2026-05-17T06:00:00.000Z", "authorId": 87, "viewCount": 830, "likeCount": 0, "commentCount": 0, "category": "free"},
]

for p in posts_data:
    post = Post(
        id=p["id"],
        title=p["title"],
        content=p["content"],
        author_id=p["authorId"],
        view_count=p["viewCount"],
        created_at=parse_dt(p["createdAt"]),
        category=CATEGORY_MAP.get(p["category"], "free"),
    )
    db.add(post)

db.flush()

# --- Comments (8) ---
comments_data = [
    {"id": 1, "postId": 12, "authorId": 104, "content": "도서관 와이파이 3층 저만 그런 게 아니었군요! 진짜 계속 끊겨서 핫스팟 켰습니다 ㅠㅠ", "createdAt": "2026-05-17T02:35:11.000Z", "parentId": None, "likeCount": 12},
    {"id": 2, "postId": 12, "authorId": 512, "content": "맥북 쓰시나요? 특정 OS에서 가끔 학내 와이파이 프로필이랑 충돌 나더라고요.", "createdAt": "2026-05-17T02:38:22.000Z", "parentId": 1, "likeCount": 24},
    {"id": 3, "postId": 14, "authorId": 104, "content": "오 통학러 앱이라니 아이디어 너무 좋네요! 혹시 테스터 모집하시나요?", "createdAt": "2026-05-17T03:15:00.000Z", "parentId": None, "likeCount": 8},
    {"id": 4, "postId": 16, "authorId": 87,  "content": "여기 직화 제육 인정합니다 ㅋㅋㅋ 불맛 제대로 나서 요즘 점심마다 도장 깨기 중이에요.", "createdAt": "2026-05-16T12:45:12.000Z", "parentId": None, "likeCount": 31},
    {"id": 5, "postId": 16, "authorId": 231, "content": "거기 현금 결제만 되나요 아니면 카드나 페이코도 다 먹히나요?", "createdAt": "2026-05-16T12:48:59.000Z", "parentId": 4, "likeCount": 0},
    {"id": 6, "postId": 16, "authorId": 302, "content": "꿀정보 감사합니다. 내일 점심은 무조건 제육으로 달립니다.", "createdAt": "2026-05-16T12:55:22.000Z", "parentId": None, "likeCount": 2},
    {"id": 7, "postId": 26, "authorId": 3,   "content": "와 안 그래도 매번 카드 찍을 때마다 에러 나서 뒷사람 눈치 보였는데 내일 당장 해볼게요.", "createdAt": "2026-05-16T07:22:15.000Z", "parentId": None, "likeCount": 7},
    {"id": 8, "postId": 26, "authorId": 4,   "content": "스마트폰 NFC 기본 모드를 카드 모드로만 바꿔도 주파수 간섭 훨씬 줄어들더라고요.", "createdAt": "2026-05-16T07:30:11.000Z", "parentId": None, "likeCount": 29},
    # --- 30번 글: 댓글 12개 ---
    {"id": 9,  "postId": 30, "authorId": 104, "content": "오 이거 진짜 좋은 아이디어네요! 당장 신청합니다.", "createdAt": "2026-05-17T06:10:00.000Z", "parentId": None, "likeCount": 3},
    {"id": 10, "postId": 30, "authorId": 421, "content": "저 양보 가능합니다. 화, 목 오후 2~5시 비워요.", "createdAt": "2026-05-17T06:15:00.000Z", "parentId": None, "likeCount": 5},
    {"id": 11, "postId": 30, "authorId": 512, "content": "수요일 오전에 자리 필요한데 매칭 어떻게 되나요?", "createdAt": "2026-05-17T06:22:00.000Z", "parentId": 10, "likeCount": 1},
    {"id": 12, "postId": 30, "authorId": 231, "content": "구글 폼 같은 걸로 신청받으면 편할 것 같아요.", "createdAt": "2026-05-17T06:30:00.000Z", "parentId": None, "likeCount": 8},
    {"id": 13, "postId": 30, "authorId": 302, "content": "동의합니다. 폼 링크만 올려주시면 바로 공유할게요!", "createdAt": "2026-05-17T06:35:00.000Z", "parentId": 12, "likeCount": 2},
    {"id": 14, "postId": 30, "authorId": 1,   "content": "저도 양보 참여하고 싶어요. 월, 수, 금 공강 시간 다 비어있습니다.", "createdAt": "2026-05-17T06:42:00.000Z", "parentId": None, "likeCount": 0},
    {"id": 15, "postId": 30, "authorId": 87,  "content": "폼 만들어서 링크 올렸습니다! 선착순 20명이에요 ~", "createdAt": "2026-05-17T06:50:00.000Z", "parentId": 12, "likeCount": 15},
    {"id": 16, "postId": 30, "authorId": 3,   "content": "폼 작성 완료! 3번째 지원자네요 ㅎㅎ", "createdAt": "2026-05-17T06:55:00.000Z", "parentId": 15, "likeCount": 0},
    {"id": 17, "postId": 30, "authorId": 4,   "content": "이런 프로젝트 학기 초부터 했어야 했는데 ㅠㅠ 그래도 지금이라도 감사합니다.", "createdAt": "2026-05-17T07:05:00.000Z", "parentId": None, "likeCount": 11},
    {"id": 18, "postId": 30, "authorId": 5,   "content": "도서관 3층 자리 기준인가요 아니면 전체 층인가요?", "createdAt": "2026-05-17T07:12:00.000Z", "parentId": None, "likeCount": 1},
    {"id": 19, "postId": 30, "authorId": 87,  "content": "전 층 대상입니다! 그룹스터디룸은 제외이고 일반 열람석만 가능해요.", "createdAt": "2026-05-17T07:18:00.000Z", "parentId": 18, "likeCount": 4},
    {"id": 20, "postId": 30, "authorId": 6,   "content": "끝내주네요. 꼭 성공했으면 좋겠습니다 응원합니다!", "createdAt": "2026-05-17T07:30:00.000Z", "parentId": None, "likeCount": 6},
]

for c in comments_data:
    comment = Comment(
        id=c["id"],
        post_id=c["postId"],
        author_id=c["authorId"],
        content=c["content"],
        created_at=parse_dt(c["createdAt"]),
        parent_id=c["parentId"],
    )
    db.add(comment)

db.commit()

# --- Likes: 30번 글에 좋아요 12개 ---
like_user_ids = [999, 104, 421, 512, 231, 302, 1, 2, 3, 4, 5, 6]
for uid in like_user_ids:
    db.add(Like(post_id=30, user_id=uid))

db.commit()
db.close()

print("Seeding complete: 20 users, 32 posts, 20 comments")