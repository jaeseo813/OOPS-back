export const formattedDate = (dateObj)=>{
    const postDate = new Date(dateObj); 
    const date = postDate.toLocaleDateString(); 
    const time = postDate.toLocaleTimeString('ko-KR', {
        hour: "numeric", 
        minute: '2-digit'
    }); 

    return {date, time}; 
}