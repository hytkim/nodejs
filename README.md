# nodejs

네, GitHub(Git) 기본 명령어를 표 형태로 정리해 드릴게요.

### **초기 설정 및 저장소 생성** ⚙️

| 명령어                                  | 설명                                       | 사용 예시                                           |
| :-------------------------------------- | :----------------------------------------- | :-------------------------------------------------- |
| `git config --global user.name "이름"`  | 최초 실행 시 사용자 이름을 설정합니다.     | `git config --global user.name "Gildong Hong"`      |
| `git config --global user.email "메일"` | 최초 실행 시 사용자 이메일을 설정합니다.   | `git config --global user.email "test@example.com"` |
| `git init`                              | 현재 디렉토리를 Git 저장소로 초기화합니다. | `git init`                                          |
| `git clone [URL]`                       | 원격 저장소를 로컬에 복제합니다.           | `git clone https://github.com/user/repo.git`        |

---

### **파일 상태 확인 및 추가** 📝

| 명령어           | 설명                                                         | 사용 예시           |
| :--------------- | :----------------------------------------------------------- | :------------------ |
| `git status`     | 작업 디렉토리와 스테이징 영역의 상태를 확인합니다.           | `git status`        |
| `git add [file]` | 특정 파일을 스테이징 영역에 추가합니다.                      | `git add README.md` |
| `git add .`      | 현재 디렉토리의 모든 변경 사항을 스테이징 영역에 추가합니다. | `git add .`         |

---

### **커밋 및 로그 확인** 💾

| 명령어                    | 설명                                             | 사용 예시                                 |
| :------------------------ | :----------------------------------------------- | :---------------------------------------- |
| `git commit -m "message"` | 스테이징된 변경 사항을 메시지와 함께 커밋합니다. | `git commit -m "Feat: Add login feature"` |
| `git log`                 | 커밋 내역을 상세하게 보여줍니다.                 | `git log`                                 |
| `git log --oneline`       | 커밋 내역을 한 줄로 간략하게 보여줍니다.         | `git log --oneline`                       |

---

### **원격 저장소 연동 및 관리** ☁️

| 명령어                        | 설명                                                 | 사용 예시                                                |
| :---------------------------- | :--------------------------------------------------- | :------------------------------------------------------- |
| `git remote add origin [URL]` | 로컬 저장소에 원격 저장소를 'origin'으로 추가합니다. | `git remote add origin https://github.com/user/repo.git` |
| `git remote -v`               | 연결된 원격 저장소의 정보를 확인합니다.              | `git remote -v`                                          |
| `git push origin [branch]`    | 로컬 브랜치의 커밋을 원격 저장소로 업로드합니다.     | `git push origin main`                                   |
| `git pull origin [branch]`    | 원격 저장소의 변경 사항을 가져와 병합합니다.         | `git pull origin main`                                   |

---

### **브랜치 관리** 🌿

| 명령어                 | 설명                                       | 사용 예시                         |
| :--------------------- | :----------------------------------------- | :-------------------------------- |
| `git branch`           | 브랜치 목록을 보여줍니다.                  | `git branch`                      |
| `git branch [name]`    | 새로운 브랜치를 생성합니다.                | `git branch feature/new-login`    |
| `git checkout [name]`  | 지정한 브랜치로 전환합니다.                | `git checkout feature/new-login`  |
| `git merge [name]`     | 현재 브랜치에 다른 브랜치를 병합합니다.    | `git merge feature/new-login`     |
| `git branch -d [name]` | 지정한 브랜치를 삭제합니다. (병합 완료 후) | `git branch -d feature/new-login` |
