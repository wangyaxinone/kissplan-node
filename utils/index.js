function recursion(data){
    var classObj = {};
    var cenjIObj = {};
    if(data && data.length && data.length>1){
       
        data.forEach((item)=>{
            classObj[item._id] = item;
            item._doc.id = item._id
            cenjIObj[item.parentId] = cenjIObj[item.parentId] || [];
            cenjIObj[item.parentId].push(item)
        })
        var newData = getRecursion(cenjIObj[0])
        return newData;
    }else{
        return data;
    }
    function getRecursion(data){
        if(data && data.length){
            data.forEach((item)=>{
                if(cenjIObj[item._id] && cenjIObj[item._id].length){
                    item._doc.children = cenjIObj[item._id]
                    item._doc.id = item._id;
                    item._doc.rowKey =  item._id;
                    getRecursion(cenjIObj[item._id]);
                }
            })
        }
        return data;
    }
}
module.exports =  {
    recursion
}