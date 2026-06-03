import ActivityList from "./ActivityList"

const ActivityContents = ({type})=>{
    return (
        <div className="slide-content" style={{ width: "25%" }}>
            <ActivityList type={type}></ActivityList>
        </div>
    ); 
}

export default ActivityContents; 