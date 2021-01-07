//用 JavaScript 写一个仅包含 inline-block 的正常流布局算法
const inlineblockEls = [
    {
        width:'200px',
        height:'200px',
        borderWidth:4,
        borderColor:'lightcoral',
        verticalAlign: 'top',
        textContent:'1',
        color:'red',
        margin:'45px 55px',
        padding:'45px'
    },
    {
        width:'200px',
        height:'100px',
        borderWidth:10,
        borderColor:'lightgray',
        textContent:'2',
        color:'red',
        margin:'13px 45px 40px 13px'
    },
    {
        width:'250px',
        height:'150px',
        borderWidth:20,
        borderColor:'blue',
        verticalAlign: 'top',
        textContent:'3',
        color:'red',
        margin:'20px 33px 22px'
    },
    {
        width:'30px',
        height:'220px',
        borderWidth:10,
        borderColor:'pink',
        textContent:'4',
        color:'red',
        margin:'33px',
        padding:'66px'
    },
    {
        width:'250px',
        height:'250px',
        borderWidth:10,
        borderColor:'green',
        textContent:'5',
        color:'red',
        padding:'22px 33px'
    },
    {
        width:'220px',
        height:'220px',
        borderWidth:2,
        borderColor:'orange',
        textContent:'6',
        color:'red',
        margin:'33px',
        padding:'55px'
    },
    {
        width:'400px',
        height:'150px',
        borderWidth:5,
        borderColor:'red',
        verticalAlign: 'top',
        textContent:'7',
        color:'red',
        margin:'44px',
    }
]
const rawCSSIbContainer = document.getElementById('cssIbContainer')//For comparing to inlineblockLayout which implements inline-block elements and their CSS rules by JS

function InlineBlockLayout(parent,ibEls,compareCSSIbLayoutContainer){

    //Function-'Global' vars
    let rowBoxes = [],_currentRowBoxIndex = 0;
    let ibLayout = initIbLayout("ibLayout"),ibLayoutCtx = ibLayout.getContext('2d');
    let ibLayoutEls = ibEls

    layoutRender()

    //Responsive
    window.addEventListener('resize',e=>{
        resizeIbLayout(ibLayout)
        layoutRender()
    })

    function initIbLayout(id){
        const iblayout = resizeIbLayout(document.createElement('canvas'))
        iblayout.id=id
        parent.appendChild(iblayout)
        return iblayout
    }

    function resizeIbLayout(iblayout){
        const {height, width} = (compareCSSIbLayoutContainer ||document.body ).getBoundingClientRect()
        iblayout.width = width
        iblayout.height = height
        return iblayout
    }

    function layoutRender(){
        rowBoxes = [{
                start:{ x:0, y:0 },
                end:{ x:0, y:0 },
                height:0,
                rowEls:[],
                maxMarginRemain:{
                    top:0,
                    bottom:0,
                    left:null,
                    right:0
                }
            }], _currentRowBoxIndex = 0;
        for (const el of ibLayoutEls) {
            rowboxesLayout(processedEl(el))
        }
        //adjust layout height after rowboxes height calculated
        ibLayout.height = (rowBoxes.map(rb=>rb.height).reduce((a,c)=>a+c,0)) + (Math.max(...ibLayoutEls.map(el=>el.borderWidth)) *2)

        rowBoxesRender()
    }

    function processedEl(el){
        el.size = {
            width:parseInt(el.width) + (2 * el.borderWidth),
            height:parseInt(el.height) + (2 * el.borderWidth),
            margin:{
                top:0,
                bottom:0,
                left:0,
                right:0
            },
            padding:{
                top:0,
                bottom:0,
                left:0,
                right:0
            }
        }
        el.verticalAlign = el.verticalAlign || 'bottom'
        if(el.margin){
            const mgArr = el.margin.split(/\s+/)
            const l = mgArr.length
            if(l ===1){
                el.size.margin = {
                    top:parseInt(mgArr[0]),
                    bottom:parseInt(mgArr[0]),
                    left:parseInt(mgArr[0]),
                    right:parseInt(mgArr[0])
                }
            }else if(l ===2){
                el.size.margin = {
                    top:parseInt(mgArr[0]),
                    bottom:parseInt(mgArr[0]),
                    left:parseInt(mgArr[1]),
                    right:parseInt(mgArr[1])
                }
            }else if(l ===3){
                el.size.margin = {
                    top:parseInt(mgArr[0]),
                    bottom:parseInt(mgArr[2]),
                    left:parseInt(mgArr[1]),
                    right:parseInt(mgArr[1])
                }
            }else if(l ===4){
                el.size.margin = {
                    top:parseInt(mgArr[0]),
                    bottom:parseInt(mgArr[2]),
                    left:parseInt(mgArr[3]),
                    right:parseInt(mgArr[1])
                }
            }
        }
        if(el.padding){
            const pdArr = el.padding.split(/\s+/)
            const l = pdArr.length
            if(l ===1){
                el.size.padding = {
                    top:parseInt(pdArr[0]),
                    bottom:parseInt(pdArr[0]),
                    left:parseInt(pdArr[0]),
                    right:parseInt(pdArr[0])
                }
            }else if(l ===2){
                el.size.padding = {
                    top:parseInt(pdArr[0]),
                    bottom:parseInt(pdArr[0]),
                    left:parseInt(pdArr[1]),
                    right:parseInt(pdArr[1])
                }
            }else if(l ===3){
                el.size.padding = {
                    top:parseInt(pdArr[0]),
                    bottom:parseInt(pdArr[2]),
                    left:parseInt(pdArr[1]),
                    right:parseInt(pdArr[1])
                }
            }else if(l ===4){
                el.size.padding = {
                    top:parseInt(pdArr[0]),
                    bottom:parseInt(pdArr[2]),
                    left:parseInt(pdArr[3]),
                    right:parseInt(pdArr[1])
                }
            }
            el.size.width += (el.size.padding.left + el.size.padding.right)
            el.size.height += (el.size.padding.top + el.size.padding.bottom)
        }

        return el
    }

    function rowboxesLayout(el){
        const canFeedIntoCurrentRowbox = ((rowBoxes[_currentRowBoxIndex].end.x ) + (el.size.margin.left + el.size.width + el.size.margin.right)) <= ibLayout.width;
        if(canFeedIntoCurrentRowbox){
            feedElIntoRowbox(el,rowBoxes[_currentRowBoxIndex])
        }else{
            rowBoxes.push({
                start:{
                    x:0,
                    y:rowBoxes.map(rb=>rb.height).reduce((a,c)=>a+c,0)
                },
                end:{
                    x:0,
                    y:rowBoxes.map(rb=>rb.height).reduce((a,c)=>a+c,0)
                },
                height:0,
                rowEls:[],
            })
            _currentRowBoxIndex+=1
            feedElIntoRowbox(el,rowBoxes[_currentRowBoxIndex])
        }
    }

    function feedElIntoRowbox(el,rowBox){
        rowBox.rowEls.push(el)
        const {width:elWidth,height:elHeight} = el.size
        const startX = rowBox.end.x
        if(el.verticalAlign === 'bottom'){
            const position = ()=>{
                const rowBoxheight = el.rowBox.height
                return {
                    x:el.rowBox.start.x + startX+el.size.margin.left+ el.borderWidth/2,//+ el.borderWidth/2 to fix canvas strock half hide on edge
                    y:rowBox.start.y + rowBoxheight -el.size.margin.bottom - elHeight + el.borderWidth/2,
                    width:elWidth-el.borderWidth,
                    height:elHeight - el.borderWidth
                }
            }
            rowBox.height = Math.max(rowBox.height,el.size.margin.top+elHeight+el.size.margin.bottom)
            rowBox.end.x += (el.size.margin.left+elWidth+el.size.margin.right)
            el.position = position
            el.rowBox = rowBox
        }else if(el.verticalAlign === 'top'){
            const position = ()=>{
                return {
                        x:el.rowBox.start.x + startX +el.size.margin.left + el.borderWidth/2, 
                        y:rowBox.start.y+el.size.margin.top+ el.borderWidth/2, 
                        width:elWidth-el.borderWidth,
                        height:elHeight - el.borderWidth
                    }
            }
            rowBox.height = Math.max(rowBox.height,el.size.margin.top+elHeight+el.size.margin.bottom)
            rowBox.end.x += (el.size.margin.left+elWidth+el.size.margin.right)
            el.position = position
            el.rowBox = rowBox
        }
    }

    function rowBoxesRender(){
        for (const rowBox of rowBoxes) {
            for (const el of rowBox.rowEls) {
                const {x,y,width,height} = el.position()
                //Border
                ibLayoutCtx.lineWidth = el.borderWidth;
                
                //Background Color
                ibLayoutCtx.fillStyle = el.backgroundColor || 'white';
                ibLayoutCtx.fillRect(x, y, width, height);
    
                //Text content with padding
                ibLayoutCtx.font = '30px sans-serif';
                ibLayoutCtx.fillStyle = el.color || 'red';
                //ibLayoutCtx.fillText(el.textContent, x+el.borderWidth/2, y+el.borderWidth/2+30);
                ibLayoutCtx.fillText(el.textContent, x+el.borderWidth/2+el.size.padding.left, y+el.borderWidth/2+30+el.size.padding.top);
    
                //Border Color
                ibLayoutCtx.strokeStyle = el.borderColor;
                ibLayoutCtx.strokeRect(x, y, width, height);
            }
        }
    }

    //Public functions
    function insertInlineblockEl(ibEl,index){
        ibLayoutEls.splice(index,0,ibEl)
        layoutRender()
    }
    function removeInlineblockEl(index){
        ibLayoutEls.splice(index,1)
        layoutRender()
    }

    return {
        ibLayout,
        rowBoxes,
        ibEls:ibLayoutEls,
        removeInlineblockEl,
        insertInlineblockEl
    }
}
const inlineblockLayoutObj = InlineBlockLayout(document.getElementById('iblayoutContainer'),inlineblockEls);
console.log(inlineblockLayoutObj)

//Support insert/remove inline-block elements
document.getElementById('insert').addEventListener('click',e=>{
    const form = document.getElementById('addForm')
    const inputs = form.getElementsByTagName('input')
    const selects = form.getElementsByTagName('select')
    //get form data:'elWidth','elHeight','elBorderWidth','elBorderColor','elTextContent','addOrder',elMargin,elPadding
    const formData = {
        width:`${inputs.elWidth.value}px`,
        height:`${inputs.elHeight.value}px`,
        borderWidth: isNaN(parseInt(inputs.elBorderWidth.value)) || !isFinite(parseInt(inputs.elBorderWidth.value)) ? 1: parseInt(inputs.elBorderWidth.value),
        borderColor:`${inputs.elBorderColor.value}`,
        textContent:`${inputs.elTextContent.value}`,
        verticalAlign:selects.verticalAlign.value,
        color:inputs.elColor.value,
        backgroundColor:inputs.elBackgroundColor.value,
        margin:inputs.elMargin.value,
        padding:inputs.elPadding.value
    }
    console.log(formData)
    //1. Add to compare HTML
    const ibCSSEl = document.createElement('div')
    ibCSSEl.style.borderWidth = `${formData.borderWidth}px`
    ibCSSEl.style.borderColor = formData.borderColor
    ibCSSEl.textContent = formData.textContent
    ibCSSEl.style.width = formData.width
    ibCSSEl.style.height = formData.height
    ibCSSEl.style.verticalAlign = formData.verticalAlign
    ibCSSEl.style.color = formData.color
    ibCSSEl.style.backgroundColor = formData.backgroundColor
    ibCSSEl.style.margin = formData.margin
    ibCSSEl.style.padding = formData.padding
    ibCSSEl.classList.add(`inner`)
    ibCSSEl.classList.add(`inner-${rawCSSIbContainer.children.length+1}`)
    const refNode = rawCSSIbContainer.children[inputs.addOrder.value-1]
    rawCSSIbContainer.insertBefore(ibCSSEl,refNode)
    //2. Add to ibLayout
    inlineblockLayoutObj.insertInlineblockEl({
        width:formData.width,
        height:formData.height,
        borderWidth:formData.borderWidth,
        borderColor:formData.borderColor,
        textContent:formData.textContent,
        verticalAlign:formData.verticalAlign,
        color:formData.color,
        backgroundColor:formData.backgroundColor,
        margin:formData.margin,
        padding:formData.padding
    },inputs.addOrder.value-1)
})
document.getElementById('remove').addEventListener('click',e=>{
    const form = document.getElementById('removeForm')
    const inputs = form.getElementsByTagName('input')
    const toBeRemovedIndex=  inputs.removeOrder.value -1
    if(rawCSSIbContainer.children[toBeRemovedIndex]){
        //1. Remove from compare HTML
        rawCSSIbContainer.removeChild(rawCSSIbContainer.children[toBeRemovedIndex])
        //2. Remove from ibLayout
        inlineblockLayoutObj.removeInlineblockEl(toBeRemovedIndex)
    }
})