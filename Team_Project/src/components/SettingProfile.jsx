import man from "../assets/man_profile.png";
import { useState, useRef, useContext } from "react";
import { UserDataContext, UserDispatchContext } from "../util/context";
import { useParams } from "react-router-dom";
import { getStoredUser, setStoredUser } from "../api/authStorage";
import * as usersApi from "../api/users";

const SettingProfile = () => {
    const users = useContext(UserDataContext);
    const {onUpdateUserInfo} = useContext(UserDispatchContext);
    const {userId} = useParams();
    const currentUser = users.find((user)=>{
        return user.userName === userId;
    });
    const [profileChange, setProfileChange] = useState(false);
    const [previewImg, setPreviewImg] = useState(currentUser?.profileImg || man);

    const fileInputRef = useRef(null);

    const onClickProfileChange = () => {
        setProfileChange(!profileChange);
    };

    const onDeleteImage = async () => {
        setPreviewImg(man);
        if (currentUser) {
            try {
                const { user } = await usersApi.updateProfile({ profileImage: "" });
                onUpdateUserInfo(user);
                const stored = getStoredUser();
                if (stored) setStoredUser({ ...stored, profileImg: "" });
            } catch (err) {
                window.alert(err.message ?? "프로필 이미지 삭제에 실패했습니다.");
            }
        }
    };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const imgResult = reader.result;
                setPreviewImg(imgResult);

                if (currentUser) {
                    try {
                        const { user } = await usersApi.updateProfile({ profileImage: imgResult });
                        onUpdateUserInfo(user);
                        const stored = getStoredUser();
                        if (stored) setStoredUser({ ...stored, profileImg: user.profileImg });
                    } catch (err) {
                        window.alert(err.message ?? "프로필 이미지 변경에 실패했습니다.");
                        setPreviewImg(currentUser.profileImg || man);
                    }
                }
            };
            reader.readAsDataURL(file);
            onClickProfileChange();
        }
    };

    return (
        <div className="profile-avatar-row">
            <div className="avatar-holder">
                <img src={previewImg} alt="사용자 프로필"/>
            </div>
            <div className="avatar-actions">
                <button
                    type="button"
                    className={`btn-avatar-upload ${profileChange ? "active" : ""}`}
                    onClick={onClickProfileChange}
                >
                    {profileChange ? "변경 취소" : "이미지 변경"}
                </button>
                <button type="button" className="btn-avatar-delete" onClick={onDeleteImage}>
                    삭제
                </button>
            </div>

            {profileChange && (
                <div className="file-input-wrapper">
                    <span className="file-input-help">💡 변경할 프로필 이미지를 컴퓨터에서 선택해주세요.</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        className="real-file-input"
                    />
                </div>
            )}
        </div>
    );
};

export default SettingProfile;

/*

배운점 

1. const reader = new FileReader(); => 컴퓨터에 있는 파일을 읽을때 쓰는 객체 
2. reader.onloadend = () => { ... }; => 파일을 다 읽었으면 어떤 로직을 실행해야하는지 
3. const imgResult = reader.result; => 다 읽은 결과물을 저장 
4. const imgResult = reader.result; => 여기에는 이미지 파일을 읽은 결과물이 들어간다. 이 변수안에는 이미지 파일이 엄청 긴 문자열 형태로 들어있다. 
5. reader.readAsDataURL(file);

6. 

<input 
    type="file" 
    accept="image/*" 
    onChange={onFileChange}
    className="real-file-input"
/>

타입은 file이고 
accept는 어떤 종류의 파일만 받을 것인지를 정해주는 속성이다. image/*이면 이미지 파일(png, jpg, jpeg, gif, webp 등)만 받겠다는 것이다. 
이것은 완벽하지 않다 악의적인 유저가 개발자도구를 켜서 파일 종류를 바꿔버릴 수도 있기 때문이다. 그래서 백연동시에 이게 이미지 파일인지 확인하는 작업을 한번 더 해줘야 한다. 
*/