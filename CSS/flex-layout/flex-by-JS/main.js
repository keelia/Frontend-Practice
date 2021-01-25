flexLayout(document.getElementById('jsImpl').getElementsByClassName('parent')[0],{
    flexWrap:'wrap',
   justifyContent:'space-evenly',
    alignContent:'space-between',
    flexDirection:'column',
    items:[
        {
            flex:1,
        },
        {
             flex:2
        },
        {
           flex:2
        },
        {
            flex:2
         }
    ]
})
function flexLayout(container,styles =  null){
    const defaultFlexSetting = {
        flexDirection:'row',//flex-direction: row;
        justifyContent:'flex-start',//justify-content: flex-start
        alignItems: 'stretch',//align-items: stretch;
        flexWrap: 'nowrap',//flex-wrap: nowrap;
        alignContent: 'stretch',//align-content: stretch;
        alignSelf: 'stretch'//align-self: stretch;
    }
    const {width,height} = container.getBoundingClientRect()
    const flexItems = container.children;
    const flexContainerSetting={
        flexWrap : styles && styles.flexWrap ? styles.flexWrap : defaultFlexSetting.flexWrap,
        justifyContent :styles && styles.justifyContent ? styles.justifyContent : defaultFlexSetting.justifyContent,
        alignContent:styles && styles.alignContent ? styles.alignContent : defaultFlexSetting.alignContent,
        flexDirection:styles && styles.flexDirection ? styles.flexDirection : defaultFlexSetting.flexDirection,
        width,
        height,
    }

    if(flexContainerSetting.flexDirection === 'column'){
    //1. Divide into Cols
    //2. Main Axis Calculation
    //3. Cross Axis Calculation
    const flexLines = []
    if(flexContainerSetting.flexWrap === 'nowrap'){
        const oneLine = []
        oneLine.mainSize = 0;
        oneLine.crossSize = 0;
        oneLine.mainAxisRemainSpace = flexContainerSetting.width
        oneLine.crossAxisRemainSpace = flexContainerSetting.height
        for (let index = 0; index < flexItems.length; index++) {
            const {width,height} = flexItems[index].getBoundingClientRect()
            const item = {
                domEl:flexItems[index],
                width:width || 0,
                height:height|| 0,
                alignSelf:styles && styles.item && styles.item[index] && styles.item[index].alignSelf ? styles.item[index].alignSelf : defaultFlexSetting.alignSelf,
                flex:styles && styles.items && styles.items[index] && (styles.items[index].flex !== undefined) ? styles.items[index].flex : null,
                isFlexible : styles && styles.items && styles.items[index] && (styles.items[index].flex !== undefined) ? true: false,
                top:0,
                left:0,
                bottom:0,
                right:0
            }
            if(item.isFlexible){
                item.height = 0
            }
            oneLine.push(item)
            oneLine.mainSize = Math.max(oneLine.mainSize,item.width)
            oneLine.crossSize +=item.height
            oneLine.crossAxisRemainSpace -= item.height
            oneLine.mainAxisRemainSpace = flexContainerSetting.width - oneLine.mainSize
        }
        flexLines.push(oneLine)
        //scale
        if(oneLine.crossAxisRemainSpace <0){
            const extraSpace =oneLine.crossAxisRemainSpace; 
            oneLine.mainSize = 0;
            oneLine.crossSize = 0;
            oneLine.mainAxisRemainSpace = flexContainerSetting.width
            oneLine.crossAxisRemainSpace = flexContainerSetting.height
            for (const flexItem of oneLine) {
                flexItem.height *= (flexContainerSetting.height/(flexContainerSetting.height + Math.abs(extraSpace)))
                flexItem.height = Number(flexItem.height.toFixed(2))
                oneLine.mainSize = Math.max(oneLine.mainSize,flexItem.width)
                oneLine.crossSize +=flexItem.height
                oneLine.crossAxisRemainSpace -= flexItem.height
                oneLine.mainAxisRemainSpace = flexContainerSetting.width - oneLine.mainSize
            }
        }

        if(oneLine.some(item=>item.isFlexible)){
            const flexibleSpaceUnit = oneLine.mainAxisRemainSpace/oneLine.filter(item=>item.isFlexible).map(item=>item.flex).reduce((a,b)=>a+b,0)
            for (const flexibleItem of oneLine.filter(item=>item.isFlexible)) {
                flexibleItem.width = flexibleItem.flex * flexibleSpaceUnit
            }
            let startX = 0, startY = 0;
            for (const flexItem of oneLine) {
                flexItem.top = startY
                flexItem.left = startX
                startX+=flexItem.width
            }
        }else{
            flexLineColLayout(oneLine,flexContainerSetting.justifyContent)
        }
    }else if(flexContainerSetting.flexWrap === 'wrap'){
        let lineIndex = -1;
        const addNewLine = (startX,startY)=>{
            lineIndex+=1
            flexLines[lineIndex] =[]
            flexLines[lineIndex].mainSize = 0;
            flexLines[lineIndex].crossSize = 0;
            flexLines[lineIndex].mainAxisRemainSpace = flexContainerSetting.width
            flexLines[lineIndex].crossAxisRemainSpace = flexContainerSetting.height
            flexLines[lineIndex].startX = startX || 0
            flexLines[lineIndex].startY = startY || 0
            return flexLines[lineIndex]
        }
        addNewLine()
        let currentLine = flexLines[lineIndex]
        for (let index = 0; index < flexItems.length; index++) {
            const {width,height} = flexItems[index].getBoundingClientRect()
            const item = {
                domEl:flexItems[index],
                width:width || 0,
                height:height|| 0,
                alignSelf:styles && styles.item && styles.item[index] && styles.item[index].alignSelf ? styles.item[index].alignSelf : defaultFlexSetting.alignSelf,
                flex:styles && styles.items && styles.items[index] && (styles.items[index].flex !== undefined) ? styles.items[index].flex : null,
                isFlexible : styles && styles.items && styles.items[index] && (styles.items[index].flex !== undefined) ? true: false,
                top:0,
                left:0,
                bottom:0,
                right:0
            }
            if(item.isFlexible){
                currentLine.push(item)
                item.height = 0
            }else{
                if(currentLine.crossAxisRemainSpace >= item.height){
                    currentLine.push(item)
                }else{
                    currentLine = addNewLine(currentLine.mainSize,currentLine.startY)//align-content:flex-start
                    currentLine.push(item)
                }
                currentLine.crossAxisRemainSpace -= item.height
                currentLine.mainSize = Math.max(currentLine.mainSize,item.width)
                currentLine.crossSize +=item.height
                currentLine.mainAxisRemainSpace = flexContainerSetting.width - currentLine.mainSize
            }
        }
        console.log(flexLines)
        //Cross Axis Calculation
        let mainAxisRemainSpace = flexContainerSetting.width - (flexLines.map(item=>item.mainSize).reduce((a,c)=>a+c,0))
        mainAxisRemainSpace = mainAxisRemainSpace < 0? 0: mainAxisRemainSpace;
        const alignContent = flexContainerSetting.alignContent
        if(alignContent === 'flex-start'){
            //do nothing
        }else if(alignContent === 'flex-end'){
            for (let index = 0; index < flexLines.length; index++) {
                const flexLine = flexLines[index];
                if(index === 0){
                    flexLine.startX = Math.abs(mainAxisRemainSpace)
                }else{
                    flexLine.startX = flexLines[index-1].startX+ flexLines[index-1].mainSize
                }
            }
        }else if(alignContent === 'stretch'){
            for (let index = 0; index < flexLines.length; index++) {
                const flexLine = flexLines[index];
                if(index === 0){
                    flexLine.startX = 0
                }else{
                    flexLine.startX = flexLines[index-1].startX + flexLines[index-1].mainSize + (Math.abs(mainAxisRemainSpace)/(flexLines.length))
                }
            }
        }else if(alignContent === 'center'){
            for (let index = 0; index < flexLines.length; index++) {
                const flexLine = flexLines[index];
                if(index === 0){
                    flexLine.startX = Math.abs(mainAxisRemainSpace)/2
                }else{
                    flexLine.startX = (flexLines[index-1].startX+ flexLines[index-1].mainSize)
                }
            }
        }else if(alignContent === 'space-between'){
            const mainSpaceUnit = Math.abs(mainAxisRemainSpace)/(flexLines.length-1)
            for (let index = 0; index < flexLines.length; index++) {
                const flexLine = flexLines[index];
                if(index === 0){
                    flexLine.startX = 0
                }else{
                    flexLine.startX = flexLines[index-1].startX+ flexLines[index-1].mainSize + mainSpaceUnit
                }
            }
        }else if(alignContent === 'space-around'){
            const mainSpaceUnit = Math.abs(mainAxisRemainSpace)/flexLines.length
            for (let index = 0; index < flexLines.length; index++) {
                const flexLine = flexLines[index];
                if(index === 0){
                    flexLine.startX = mainSpaceUnit/2
                }else{
                    flexLine.startX = flexLines[index-1].startX+ flexLines[index-1].mainSize + mainSpaceUnit
                }
            }
        }else if(alignContent === 'space-evenly'){
            const mainSpaceUnit = Math.abs(mainAxisRemainSpace)/(flexLines.length+1)
            for (let index = 0; index < flexLines.length; index++) {
                const flexLine = flexLines[index];
                if(index === 0){
                    flexLine.startX = mainSpaceUnit
                }else{
                    flexLine.startX = flexLines[index-1].startX+ flexLines[index-1].mainSize + mainSpaceUnit
                }
            }
        }
        // //Main Axis Calculation
        console.log(flexContainerSetting.justifyContent)
        for (const flexLine of flexLines) {
            flexLineColLayout(flexLine,flexContainerSetting.justifyContent)
        }
    }
    //4. Paint
    for (const flexLine of flexLines) {
        for (const flexItem of flexLine) {
            flexItem.domEl.style.top = `${flexItem.top}px`
            flexItem.domEl.style.left = `${flexItem.left}px`
            flexItem.domEl.style.height = `${flexItem.height}px`
        }
    }
    }else if(flexContainerSetting.flexDirection === 'row'){
    //1. Divide into Rows
    //2. Main Axis Calculation
    //3. Cross Axis Calculation
    const flexLines = []
    if(flexContainerSetting.flexWrap === 'nowrap'){
        const oneLine = []
        oneLine.mainSize = 0;
        oneLine.crossSize = 0;
        oneLine.mainAxisRemainSpace = flexContainerSetting.width
        oneLine.crossAxisRemainSpace = flexContainerSetting.height
        for (let index = 0; index < flexItems.length; index++) {
            const {width,height} = flexItems[index].getBoundingClientRect()
            const item = {
                domEl:flexItems[index],
                width:width || 0,
                height:height|| 0,
                alignSelf:styles && styles.item && styles.item[index] && styles.item[index].alignSelf ? styles.item[index].alignSelf : defaultFlexSetting.alignSelf,
                flex:styles && styles.items && styles.items[index] && (styles.items[index].flex !== undefined) ? styles.items[index].flex : null,
                isFlexible : styles && styles.items && styles.items[index] && (styles.items[index].flex !== undefined) ? true: false,
                top:0,
                left:0,
                bottom:0,
                right:0
            }
            if(item.isFlexible){
                item.width = 0
            }
            oneLine.push(item)
            oneLine.mainSize +=item.width
            oneLine.crossSize = Math.max(oneLine.crossSize,item.height)
            oneLine.mainAxisRemainSpace -= item.width
            oneLine.crossAxisRemainSpace = flexContainerSetting.height - oneLine.crossSize
        }
        flexLines.push(oneLine)
        console.log(flexLines)
        //scale
        if(oneLine.mainAxisRemainSpace <0){
            const extraSpace =oneLine.mainAxisRemainSpace; 
            oneLine.mainSize = 0;
            oneLine.crossSize = 0;
            oneLine.mainAxisRemainSpace = flexContainerSetting.width
            oneLine.crossAxisRemainSpace = flexContainerSetting.height
            for (const flexItem of oneLine) {
                flexItem.width *= (flexContainerSetting.width/(flexContainerSetting.width + Math.abs(extraSpace)))
                flexItem.width = Number(flexItem.width.toFixed(2))
                oneLine.mainSize +=flexItem.width
                oneLine.crossSize = Math.max(oneLine.crossSize,flexItem.height)
                oneLine.mainAxisRemainSpace -= flexItem.width
                oneLine.crossAxisRemainSpace = flexContainerSetting.height - oneLine.crossSize
            }
        }
        if(oneLine.some(item=>item.isFlexible)){
            const flexibleSpaceUnit = oneLine.mainAxisRemainSpace/oneLine.filter(item=>item.isFlexible).map(item=>item.flex).reduce((a,b)=>a+b,0)
            for (const flexibleItem of oneLine.filter(item=>item.isFlexible)) {
                flexibleItem.width = flexibleItem.flex * flexibleSpaceUnit
            }
            let startX = 0, startY = 0;
            for (const flexItem of oneLine) {
                flexItem.top = startY
                flexItem.left = startX
                startX+=flexItem.width
            }
        }else{
            flexLineLayout(oneLine,flexContainerSetting.justifyContent)
        }
    }else if(flexContainerSetting.flexWrap === 'wrap'){
        let lineIndex = -1;
        const addNewLine = (startX,startY)=>{
            lineIndex+=1
            flexLines[lineIndex] =[]
            flexLines[lineIndex].mainSize = 0;
            flexLines[lineIndex].crossSize = 0;
            flexLines[lineIndex].mainAxisRemainSpace = flexContainerSetting.width
            flexLines[lineIndex].startX = startX || 0
            flexLines[lineIndex].startY = startY || 0
            return flexLines[lineIndex]
        }
        addNewLine()
        let currentLine = flexLines[lineIndex]
        for (let index = 0; index < flexItems.length; index++) {
            const {width,height} = flexItems[index].getBoundingClientRect()
            const item = {
                domEl:flexItems[index],
                width:width || 0,
                height:height|| 0,
                alignSelf:styles && styles.item && styles.item[index] && styles.item[index].alignSelf ? styles.item[index].alignSelf : defaultFlexSetting.alignSelf,
                flex:styles && styles.items && styles.items[index] && (styles.items[index].flex !== undefined) ? styles.items[index].flex : null,
                isFlexible : styles && styles.items && styles.items[index] && (styles.items[index].flex !== undefined) ? true: false,
                top:0,
                left:0,
                bottom:0,
                right:0
            }
            if(item.isFlexible){
                currentLine.push(item)
                item.width = 0
                currentLine.mainSize = Math.max(currentLine.mainSize,item.width)
                currentLine.crossSize = Math.max(currentLine.crossSize,item.height)
            }else{
                if(currentLine.mainAxisRemainSpace >= item.width){
                    currentLine.push(item)
                }else{
                    currentLine = addNewLine(currentLine.startX,currentLine.crossSize)//align-content:flex-start
                    currentLine.push(item)
                }
                currentLine.mainAxisRemainSpace -= item.width
                currentLine.mainSize = Math.max(currentLine.mainSize,item.width)
                currentLine.crossSize = Math.max(currentLine.crossSize,item.height)
            }
        }

        //Cross Axis Calculation
        let crossAxisRemainSpace = flexContainerSetting.height - (flexLines.map(item=>item.crossSize).reduce((a,c)=>a+c,0))
        crossAxisRemainSpace = crossAxisRemainSpace < 0? 0: crossAxisRemainSpace;
        const alignContent = flexContainerSetting.alignContent
        if(alignContent === 'flex-start'){
            //do nothing
        }else if(alignContent === 'flex-end'){
            for (let index = 0; index < flexLines.length; index++) {
                const flexLine = flexLines[index];
                if(index === 0){
                    flexLine.startY = Math.abs(crossAxisRemainSpace)
                }else{
                    flexLine.startY = flexLines[index-1].startY+ flexLines[index-1].crossSize
                }
            }
        }else if(alignContent === 'stretch'){
            for (let index = 0; index < flexLines.length; index++) {
                const flexLine = flexLines[index];
                if(index === 0){
                    flexLine.startY = 0
                }else{
                    flexLine.startY = flexLines[index-1].startY+ flexLines[index-1].crossSize + (Math.abs(crossAxisRemainSpace)/(flexLines.length))
                }
            }
        }else if(alignContent === 'center'){
            for (let index = 0; index < flexLines.length; index++) {
                const flexLine = flexLines[index];
                if(index === 0){
                    flexLine.startY = crossAxisRemainSpace/2
                }else{
                    flexLine.startY = (flexLines[index-1].startY+ flexLines[index-1].crossSize)
                }
            }
        }else if(alignContent === 'space-between'){
            const crossSpaceUnit = crossAxisRemainSpace/(flexLines.length-1)
            for (let index = 0; index < flexLines.length; index++) {
                const flexLine = flexLines[index];
                if(index === 0){
                    flexLine.startY = 0
                }else{
                    flexLine.startY = flexLines[index-1].startY+ flexLines[index-1].crossSize + crossSpaceUnit
                }
            }
        }else if(alignContent === 'space-around'){
            const crossSpaceUnit = crossAxisRemainSpace/flexLines.length
            for (let index = 0; index < flexLines.length; index++) {
                const flexLine = flexLines[index];
                if(index === 0){
                    flexLine.startY = crossSpaceUnit/2
                }else{
                    flexLine.startY = flexLines[index-1].startY+ flexLines[index-1].crossSize + crossSpaceUnit
                }
            }
        }else if(alignContent === 'space-evenly'){
            const crossSpaceUnit = crossAxisRemainSpace/(flexLines.length+1)
            for (let index = 0; index < flexLines.length; index++) {
                const flexLine = flexLines[index];
                if(index === 0){
                    flexLine.startY = crossSpaceUnit
                }else{
                    flexLine.startY = flexLines[index-1].startY+ flexLines[index-1].crossSize + crossSpaceUnit
                }
            }
        }
        //Main Axis Calculation
        for (const flexLine of flexLines) {
            flexLineLayout(flexLine,flexContainerSetting.justifyContent)
        }
    }
    //4. Paint
    for (const flexLine of flexLines) {
        for (const flexItem of flexLine) {
            flexItem.domEl.style.top = `${flexItem.top}px`
            flexItem.domEl.style.left = `${flexItem.left}px`
            flexItem.domEl.style.width = `${flexItem.width}px`
        }
    }
    }
}

function flexLineColLayout(flexline,justifyContent){
    let oneLine = flexline
    if(oneLine.some(item=>item.isFlexible)){
        const flexibleSpaceUnit = oneLine.crossAxisRemainSpace/oneLine.filter(item=>item.isFlexible).map(item=>item.flex).reduce((a,b)=>a+b,0)
        for (const flexibleItem of oneLine.filter(item=>item.isFlexible)) {
            flexibleItem.height = flexibleItem.flex * flexibleSpaceUnit
        }
        let startX = flexline.startX, startY = flexline.startY;
        for (const flexItem of oneLine) {
            flexItem.top = startY
            flexItem.left = startX
            startY+=flexItem.height
        }
    }else{
        //justify-content takes effect then
        if(justifyContent === 'flex-start'){
            let startX = flexline.startX || 0, startY = flexline.startY || 0;
            for (const flexItem of oneLine) {
                flexItem.top = startY
                flexItem.left = startX
                startY+=flexItem.height
            }
        }else if(justifyContent === 'flex-end'){
            let startX =flexline.startX || 0, startY = flexline.crossAxisRemainSpace;
            for (const flexItem of oneLine) {
                flexItem.top = startY
                flexItem.left = startX
                startY+=flexItem.height
            }
        }else if(justifyContent === 'stretch'){
            let startX = flexline.startX || 0, startY = flexline.startY || 0;
            for (const flexItem of oneLine) {
                flexItem.top = startY
                flexItem.left = startX
                startY+=flexItem.height
            }
        }else if(justifyContent === 'center'){
            let startX =  flexline.startY || 0 , startY =oneLine.crossAxisRemainSpace/2 + (flexline.startY || 0);
            for (const flexItem of oneLine) {
                flexItem.top = startY
                flexItem.left = startX
                startY+=flexItem.height
            }
        }else if(justifyContent === 'space-between'){
            let startX = flexline.startX || 0, startY = flexline.startY || 0;
            for (let index = 0; index < oneLine.length; index++) {
                const flexItem = oneLine[index];
                if(index!== 0){
                    startY+=oneLine.crossAxisRemainSpace/(oneLine.length -1)
                }
                flexItem.top = startY
                flexItem.left = startX
                startY+=flexItem.height
            }
        }else if(justifyContent === 'space-around'){
            let startX = flexline.startX || 0, startY = flexline.startY || 0;
            for (let index = 0; index < oneLine.length; index++) {
                const flexItem = oneLine[index];
                if(index === 0){
                    startY+=(oneLine.crossAxisRemainSpace/(oneLine.length))/2
                }else{
                    startY+=(oneLine.crossAxisRemainSpace/(oneLine.length))
                }
                flexItem.top = startY
                flexItem.left = startX
                startY+=flexItem.height
            }
        }else if(justifyContent === 'space-evenly'){
            let startX = flexline.startX || 0, startY = flexline.startY || 0;
            console.log(startX,startY)
            for (let index = 0; index < oneLine.length; index++) {
                const flexItem = oneLine[index];
                startY+=oneLine.crossAxisRemainSpace/(oneLine.length+1)
                flexItem.top = startY
                flexItem.left = startX
                startY+=flexItem.height
            }
        }
    }
}

function flexLineLayout(flexline,justifyContent){
    let oneLine = flexline
    if(oneLine.some(item=>item.isFlexible)){
        const flexibleSpaceUnit = oneLine.mainAxisRemainSpace/oneLine.filter(item=>item.isFlexible).map(item=>item.flex).reduce((a,b)=>a+b,0)
        for (const flexibleItem of oneLine.filter(item=>item.isFlexible)) {
            flexibleItem.width = flexibleItem.flex * flexibleSpaceUnit
        }
        let startX = flexline.startX, startY = flexline.startY;
        for (const flexItem of oneLine) {
            flexItem.top = startY
            flexItem.left = startX
            startX+=flexItem.width
        }
    }else{
        //justify-content takes effect then
        if(justifyContent === 'flex-start'){
            let startX = flexline.startX || 0, startY = flexline.startY || 0;
            for (const flexItem of oneLine) {
                flexItem.top = startY
                flexItem.left = startX
                startX+=flexItem.width
            }
        }else if(justifyContent === 'flex-end'){
            let startX = oneLine.mainAxisRemainSpace, startY = flexline.startY || 0;
            for (const flexItem of oneLine) {
                flexItem.top = startY
                flexItem.left = startX
                startX+=flexItem.width
            }
        }else if(justifyContent === 'stretch'){
            let startX = flexline.startX || 0, startY = flexline.startY || 0;
            for (const flexItem of oneLine) {
                flexItem.top = startY
                flexItem.left = startX
                startX+=flexItem.width
            }
        }else if(justifyContent === 'center'){
            let startX = oneLine.mainAxisRemainSpace/2 + (flexline.startX || 0), startY = flexline.startY || 0;
            for (const flexItem of oneLine) {
                flexItem.top = startY
                flexItem.left = startX
                startX+=flexItem.width
            }
        }else if(justifyContent === 'space-between'){
            let startX = flexline.startX || 0, startY = flexline.startY || 0;
            for (let index = 0; index < oneLine.length; index++) {
                const flexItem = oneLine[index];
                if(index!== 0){
                    startX+=oneLine.mainAxisRemainSpace/(oneLine.length -1)
                }
                flexItem.top = startY
                flexItem.left = startX
                startX+=flexItem.width
            }
        }else if(justifyContent === 'space-around'){
            let startX = flexline.startX || 0, startY = flexline.startY || 0;
            for (let index = 0; index < oneLine.length; index++) {
                const flexItem = oneLine[index];
                if(index === 0){
                    startX+=(oneLine.mainAxisRemainSpace/(oneLine.length))/2
                }else{
                    startX+=(oneLine.mainAxisRemainSpace/(oneLine.length))
                }
                flexItem.top = startY
                flexItem.left = startX
                startX+=flexItem.width
            }
        }else if(justifyContent === 'space-evenly'){
            let startX = flexline.startX || 0, startY = flexline.startY || 0;
            for (let index = 0; index < oneLine.length; index++) {
                const flexItem = oneLine[index];
                startX+=oneLine.mainAxisRemainSpace/(oneLine.length+1)
                flexItem.top = startY
                flexItem.left = startX
                startX+=flexItem.width
            }
        }
    }
}
