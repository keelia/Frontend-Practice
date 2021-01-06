//用 JavaScript 写一个仅包含 inline-block 的正常流布局算法
const ibEls = [
    {
        width:'200px',
        height:'200px',
        borderWidth:4,
        borderColor:'lightcoral',
        verticalAlign: 'top',
        textContent:'1',
        color:'red',
    },
    {
        width:'200px',
        height:'100px',
        borderWidth:10,
        borderColor:'lightgray',
        textContent:'2',
        color:'red'
    },
    {
        width:'250px',
        height:'150px',
        borderWidth:20,
        borderColor:'blue',
        verticalAlign: 'top',
        textContent:'3',
        color:'red'
    },
    {
        width:'30px',
        height:'220px',
        borderWidth:10,
        borderColor:'pink',
        textContent:'4',
        color:'red'
    },
    {
        width:'250px',
        height:'250px',
        borderWidth:10,
        borderColor:'green',
        textContent:'5',
        color:'red'
    },
    {
        width:'220px',
        height:'220px',
        borderWidth:2,
        borderColor:'orange',
        textContent:'6',
        color:'red'
    },
    {
        width:'400px',
        height:'150px',
        borderWidth:5,
        borderColor:'red',
        verticalAlign: 'top',
        textContent:'7',
        color:'red'
    }
]

function inlineBlockLayout(ibLayoutContainer,ibEls,outerContainer){
    const {height, width} =outerContainer.getBoundingClientRect()
    //Function-'Global' vars
    let rowBoxes = [],currentRowBoxIndex = 0;
    let ibLayout = initIbLayout("ibLayout",width,height,ibLayoutContainer),ctx = ibLayout.getContext('2d')
    function initIbLayout(id, width,height,parent){
        const ibContainer = document.createElement('canvas')
        ibContainer.width = width
        ibContainer.height = height
        ibContainer.id=id
        parent.appendChild(ibContainer)
        return ibContainer
    }
    //add eventlistener
    window.addEventListener('resize',e=>{
        const {height, width} = outerContainer.getBoundingClientRect()
        ibLayout.width = width
        ibLayout.height = height
        layout(ibLayout,ibEls)
    })
    
    layout(ibLayout,ibEls)

    function layout(ibLayout,ibLayoutEls){
        rowBoxes = [{
                start:{ x:0, y:0 },
                end:{ x:0, y:0 },
                height:0,
                rowEls:[],
            }], currentRowBoxIndex = 0;
        for (const el of ibLayoutEls) {
            el.size = {
                width:parseInt(el.width) + (2 * el.borderWidth),
                height:parseInt(el.height) + (2 * el.borderWidth)
            }
            rowboxLayout(ibLayout.width,el)
        }
        adjustLayoutSize()
        rowBoxesRender(rowBoxes)
    }

    function adjustLayoutSize(){
        const remain = Math.max(...ibEls.map(el=>el.borderWidth)) *2;
        const rowBoxesHeight = rowBoxes.map(rb=>rb.height).reduce((a,c)=>a+c,0);
        ibLayout.height = rowBoxesHeight + remain
        //ibLayout.height = Math.max(ibLayout.height,rowBoxes.map(rb=>rb.height).reduce((a,c)=>a+c,0))+  (Math.max(...ibEls.map(el=>el.borderWidth)) *2)
    }
    function rowboxLayout(totolWidth,el){
        const canFilled = (rowBoxes[currentRowBoxIndex].end.x + el.size.width) <= totolWidth;
        if(canFilled){
            //feed into rowBox
            feedElIntoRowbox(el,rowBoxes[currentRowBoxIndex])
        }else{
            //create rowbox
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
            currentRowBoxIndex+=1
            feedElIntoRowbox(el,rowBoxes[currentRowBoxIndex])
        }
    }

    function feedElIntoRowbox(el,rowBox){
        rowBox.rowEls.push(el)
        const verticalAlign = el.verticalAlign || 'bottom';
        const {width:elWidth,height:elHeight} = el.size
        const startX = rowBox.end.x
        if(verticalAlign === 'bottom'){
            const position = ()=>{
                const rowBoxheight = el.rowBox.height
                return {
                    x:el.rowBox.start.x + startX+ el.borderWidth/2,
                    y:rowBox.start.y + rowBoxheight - elHeight + el.borderWidth/2,
                    width:elWidth-el.borderWidth,
                    height:elHeight - el.borderWidth
                }
            }
            rowBox.height = Math.max(rowBox.height,elHeight)
            rowBox.end.x += elWidth
            el.position = position
            el.rowBox = rowBox
        }else if(verticalAlign === 'top'){
            const position = ()=>{
                return {x:el.rowBox.start.x + startX+ el.borderWidth/2, 
                        y:rowBox.start.y+ el.borderWidth/2, 
                        width:elWidth-el.borderWidth,
                        height:elHeight - el.borderWidth
                    }
            }
            rowBox.height = Math.max(rowBox.height,elHeight)
            rowBox.end.x += elWidth
            el.position = position
            el.rowBox = rowBox
        }
    }

    function rowBoxesRender(rowBoxes){
        for (const rowBox of rowBoxes) {
            rowBoxRender(rowBox)
        }
    }

    function rowBoxRender(rowBox){
        for (const el of rowBox.rowEls) {
            const {x,y,width,height} = el.position()
            ctx.lineWidth = el.borderWidth;
            ctx.font = '30px "Fira Sans", sans-serif';
     
            ctx.fillStyle = el.backgroundColor || 'white';
            ctx.fillRect(x, y, width, height);

            ctx.fillStyle = el.color || 'red';
            ctx.fillText(el.textContent, x+el.borderWidth, y+el.borderWidth+30);

            ctx.strokeStyle = el.borderColor;
            ctx.strokeRect(x, y, width, height);
        }
    }

    //Public functions
    function insertInlineblockEl(ibEl,index){
        ibEls.splice(index,0,ibEl)
        layout(ibLayout,ibEls)
    }
    function removeInlineblockEl(index){
        if(index >= 0){
            ibEls.splice(index,1)
            layout(ibLayout,ibEls)
        }
    }

    return {
        ibLayout,
        rowBoxes,
        ibEls,
        removeInlineblockEl,
        insertInlineblockEl
    }
}
const rawCSSIbContainer = document.getElementById('cssIbContainer')
const ibLayout = inlineBlockLayout(document.getElementById('iblayoutContainer'),ibEls,rawCSSIbContainer);
console.log(ibLayout)

const insertBtn = document.getElementById('insert')
insertBtn.addEventListener('click',e=>{
    const form = document.getElementById('addForm')
    const inputs = form.getElementsByTagName('input')
    const selects = form.getElementsByTagName('select')
    //get form data:'elWidth','elHeight','elBorderWidth','elBorderColor','elTextContent','addOrder'
    const formData = {
        width:`${inputs.elWidth.value}px`,
        height:`${inputs.elHeight.value}px`,
        borderWidth: isNaN(parseInt(inputs.elBorderWidth.value)) || !isFinite(parseInt(inputs.elBorderWidth.value)) ? 1: parseInt(inputs.elBorderWidth.value),
        borderColor:`${inputs.elBorderColor.value}`,
        textContent:`${inputs.elTextContent.value}`,
        verticalAlign:selects.verticalAlign.value,
        color:inputs.elColor.value,
        backgroundColor:inputs.elBackgroundColor.value
    }
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
    ibCSSEl.classList.add(`inner`)
    ibCSSEl.classList.add(`inner-${rawCSSIbContainer.children.length+1}`)
    const refNode = rawCSSIbContainer.children[inputs.addOrder.value-1]
    rawCSSIbContainer.insertBefore(ibCSSEl,refNode)
    //2. Add to ibLayout
    ibLayout.insertInlineblockEl({
        width:formData.width,
        height:formData.height,
        borderWidth:formData.borderWidth,
        borderColor:formData.borderColor,
        textContent:formData.textContent,
        verticalAlign:formData.verticalAlign,
        color:formData.color,
        backgroundColor:formData.backgroundColor
    },inputs.addOrder.value-1)
})
const removeBtn = document.getElementById('remove')
removeBtn.addEventListener('click',e=>{
    const form = document.getElementById('removeForm')
    const inputs = form.getElementsByTagName('input')
    const toBeRemovedIndex=  inputs.removeOrder.value -1
    if(rawCSSIbContainer.children[toBeRemovedIndex]){
        //1. Remove from compare HTML
        rawCSSIbContainer.removeChild(rawCSSIbContainer.children[toBeRemovedIndex])
        //2. Remove from ibLayout
        ibLayout.removeInlineblockEl(toBeRemovedIndex)
    }
})