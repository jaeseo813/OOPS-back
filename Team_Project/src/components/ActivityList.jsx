import { useEffect, useState } from "react";
import ActivityItem from "./ActivityItem";
import { useParams } from "react-router-dom";
import { fetchMyPosts, fetchMyComments, fetchMyLikes } from "../api/users";

const ActivityList = ({type})=>{
    const {userId} = useParams();
    const [myActivity, setMyActivity] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                let data;
                if (type === "post") data = await fetchMyPosts();
                else if (type === "comment") data = await fetchMyComments();
                else data = await fetchMyLikes();
                setMyActivity(data);
            } catch (err) {
                console.error("활동 내역 로드 실패:", err);
                setMyActivity([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [type, userId]);

    if (loading) {
        return <p style={{padding: "20px", color: "#888", textAlign: "center"}}>불러오는 중...</p>;
    }

    return (
        <div className="activity-list">
            {myActivity.length === 0 ? (
                <p style={{padding: "20px", color: "#888", textAlign: "center"}}>아직 관련 글이 존재하지 않습니다..</p>
            ) : (
                myActivity.map((item, idx)=>{
                    return <ActivityItem key={idx} type={type} title={item.title || item.content} createdAt={item.createdAt} postId={item.postId} id={type==="comment" ? item.id : ""}></ActivityItem>
                })
            )}
        </div>
    );
}

export default ActivityList; 