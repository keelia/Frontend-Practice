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
        alignItems:styles && styles.alignItems ? styles.alignItems : defaultFlexSetting.alignItems,
        width,
        height,
    }
    console.log(styles)

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
            const {width,height} =  styles && styles.items && styles.items[index]  ?styles.items[index] :{width:0,height0}
            const item = {
                domEl:flexItems[index],
                width:width || 0,
                height:height|| 0,
                alignSelf:styles && styles.items && styles.items[index] && styles.items[index].alignSelf ? styles.items[index].alignSelf : (flexContainerSetting.alignItems || defaultFlexSetting.alignSelf),
                flex:styles && styles.items && styles.items[index] && styles.items[index].flex ? styles.items[index].flex : null,
                isFlexible : styles && styles.items && styles.items[index] && styles.items[index].flex ? true: false,
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
            const {width,height} = styles && styles.items && styles.items[index]  ?styles.items[index] :{width:0,height0}
            const item = {
                domEl:flexItems[index],
                width:width || 0,
                height:height|| 0,
                alignSelf:styles && styles.items && styles.items[index] && styles.items[index].alignSelf ? styles.items[index].alignSelf :  (flexContainerSetting.alignItems || defaultFlexSetting.alignSelf),
                flex:styles && styles.items && styles.items[index] && styles.items[index].flex ? styles.items[index].flex : null,
                isFlexible : styles && styles.items && styles.items[index] && styles.items[index].flex ? true: false,
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
                    debugger
                    if(currentLine.length === 0){
                        item.height = currentLine.crossAxisRemainSpace
                        currentLine.push(item)
                    }else{
                        currentLine = addNewLine(currentLine.mainSize,currentLine.startY)//align-content:flex-start
                        currentLine.push(item)
                    }
                }
                currentLine.crossAxisRemainSpace -= item.height
                currentLine.mainSize = Math.max(currentLine.mainSize,item.width)
                currentLine.crossSize = Math.max(currentLine.crossSize,item.height) //currentLine.crossSize +=item.height
                currentLine.mainAxisRemainSpace = flexContainerSetting.width - currentLine.mainSize
            }
        }
        //scale
        console.log(flexLines)
        debugger
        for (const flexLine of flexLines) {
            if(flexLine.crossAxisRemainSpace <0){
                flexLine[0].height = flexContainerSetting.height
                flexLine.crossAxisRemainSpace = 0
                flexLine.crossSize = flexContainerSetting.height
            }
        }
        console.log(flexLines)
        debugger
        //Cross Axis Calculation
        let mainAxisRemainSpace = flexContainerSetting.width - (flexLines.map(item=>item.mainSize).reduce((a,c)=>a+c,0))
       // mainAxisRemainSpace = mainAxisRemainSpace < 0? 0: mainAxisRemainSpace;
        const alignContent = flexContainerSetting.alignContent
        if(alignContent === 'flex-start'){
            for (let index = 0; index < flexLines.length; index++) {
                const flexLine = flexLines[index];
                if(index === 0){
                    flexLine.startX = 0
                }else{
                    flexLine.startX = flexLines[index-1].startX+ flexLines[index-1].mainSize
                }
            }
        }else if(alignContent === 'flex-end'){
            for (let index = 0; index < flexLines.length; index++) {
                const flexLine = flexLines[index];
                if(index === 0){
                    flexLine.startX = mainAxisRemainSpace
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
                    flexLine.startX = flexLines[index-1].startX + flexLines[index-1].mainSize + (mainAxisRemainSpace/(flexLines.length))
                }
            }
        }else if(alignContent === 'center'){
            for (let index = 0; index < flexLines.length; index++) {
                const flexLine = flexLines[index];
                if(index === 0){
                    flexLine.startX = mainAxisRemainSpace/2
                }else{
                    flexLine.startX = (flexLines[index-1].startX+ flexLines[index-1].mainSize)
                }
            }
        }else if(alignContent === 'space-between'){
            const mainSpaceUnit = mainAxisRemainSpace/(flexLines.length-1)
            for (let index = 0; index < flexLines.length; index++) {
                const flexLine = flexLines[index];
                if(index === 0){
                    flexLine.startX = 0
                }else{
                    flexLine.startX = flexLines[index-1].startX+ flexLines[index-1].mainSize + mainSpaceUnit
                }
            }
        }else if(alignContent === 'space-around'){
            const mainSpaceUnit = mainAxisRemainSpace/flexLines.length
            for (let index = 0; index < flexLines.length; index++) {
                const flexLine = flexLines[index];
                if(index === 0){
                    flexLine.startX = mainSpaceUnit/2
                }else{
                    flexLine.startX = flexLines[index-1].startX+ flexLines[index-1].mainSize + mainSpaceUnit
                }
            }
        }else if(alignContent === 'space-evenly'){
            const mainSpaceUnit = mainAxisRemainSpace/(flexLines.length+1)
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
        for (const flexLine of flexLines) {
            flexLineColLayout(flexLine,flexContainerSetting.justifyContent)
        }

        //AlignItems
        alignFlexItems(flexLines,flexContainerSetting.alignItems,'main')
    }
    //4. Paint
    paintFlexLines(flexLines,'height')
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
            const {width,height} =  styles && styles.items && styles.items[index]  ?styles.items[index] :{width:0,height0}
            const item = {
                domEl:flexItems[index],
                width:width || 0,
                height:height|| 0,
                alignSelf:styles && styles.items && styles.items[index] && styles.items[index].alignSelf ? styles.items[index].alignSelf :  (flexContainerSetting.alignItems || defaultFlexSetting.alignSelf),
                flex:styles && styles.items && styles.items[index] && styles.items[index].flex ? styles.items[index].flex : null,
                isFlexible : styles && styles.items && styles.items[index] && styles.items[index].flex ? true: false,
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
            const {width,height} =  styles && styles.items && styles.items[index]  ?styles.items[index] :{width:0,height0}
            const item = {
                domEl:flexItems[index],
                width:width || 0,
                height:height|| 0,
                alignSelf:styles && styles.items && styles.items[index] && styles.items[index].alignSelf ? styles.items[index].alignSelf :  (flexContainerSetting.alignItems || defaultFlexSetting.alignSelf),
                flex:styles && styles.items && styles.items[index] && styles.items[index].flex ? styles.items[index].flex : null,
                isFlexible : styles && styles.items && styles.items[index] && styles.items[index].flex ? true: false,
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
                    if(currentLine.length === 0){
                        item.width = currentLine.mainAxisRemainSpace
                        currentLine.push(item)
                    }else{
                        currentLine = addNewLine(currentLine.startX,currentLine.crossSize)//align-content:flex-start
                        currentLine.push(item)
                    }
                }
                currentLine.mainAxisRemainSpace -= item.width
                currentLine.mainSize = Math.max(currentLine.mainSize,item.width)
                currentLine.crossSize = Math.max(currentLine.crossSize,item.height)
            }
        }
       console.log(flexLines)
        //scale
        for (const flexLine of flexLines) {
            if(flexLine.mainAxisRemainSpace <0){
                flexLine[0].width = flexContainerSetting.width
            }
        }
        //Cross Axis Calculation
        let crossAxisRemainSpace = flexContainerSetting.height - (flexLines.map(item=>item.crossSize).reduce((a,c)=>a+c,0))
        //crossAxisRemainSpace = crossAxisRemainSpace < 0? 0: crossAxisRemainSpace;
        const alignContent = flexContainerSetting.alignContent
        if(alignContent === 'flex-start'){
            for (let index = 0; index < flexLines.length; index++) {
                const flexLine = flexLines[index];
                if(index === 0){
                    flexLine.startY = 0
                }else{
                    flexLine.startY = flexLines[index-1].startY+ flexLines[index-1].crossSize
                }
            }
        }else if(alignContent === 'flex-end'){
            for (let index = 0; index < flexLines.length; index++) {
                const flexLine = flexLines[index];
                if(index === 0){
                    flexLine.startY = crossAxisRemainSpace
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
                    flexLine.startY = flexLines[index-1].startY+ flexLines[index-1].crossSize + (crossAxisRemainSpace/(flexLines.length))
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

        //AlignItems
        alignFlexItems(flexLines,flexContainerSetting.alignItems,'cross')
    }
    //4. Paint
    paintFlexLines(flexLines,'width')
    }
}


function flexLineColLayout(flexline,justifyContent){
    if(flexline.some(item=>item.isFlexible)){
        const flexibleSpaceUnit = flexline.crossAxisRemainSpace/flexline.filter(item=>item.isFlexible).map(item=>item.flex).reduce((a,b)=>a+b,0)
        for (const flexibleItem of flexline.filter(item=>item.isFlexible)) {
            flexibleItem.height = flexibleItem.flex * flexibleSpaceUnit
        }
        let startX = flexline.startX, startY = flexline.startY;
        for (const flexItem of flexline) {
            flexItem.top = startY
            flexItem.left = startX
            startY+=flexItem.height
        }
    }else{
        //justify-content takes effect then
        if(justifyContent === 'flex-start'){
            let startX = flexline.startX || 0, startY = flexline.startY || 0;
            for (const flexItem of flexline) {
                flexItem.top = startY
                flexItem.left = startX
                startY+=flexItem.height
            }
        }else if(justifyContent === 'flex-end'){
            let startX =flexline.startX || 0, startY = flexline.crossAxisRemainSpace;
            for (const flexItem of flexline) {
                flexItem.top = startY
                flexItem.left = startX
                startY+=flexItem.height
            }
        }else if(justifyContent === 'stretch'){
            let startX = flexline.startX || 0, startY = flexline.startY || 0;
            for (const flexItem of flexline) {
                flexItem.top = startY
                flexItem.left = startX
                startY+=flexItem.height
            }
        }else if(justifyContent === 'center'){
            let startX =  flexline.startX || 0 , startY =flexline.crossAxisRemainSpace/2 + (flexline.startY || 0);
            for (const flexItem of flexline) {
                flexItem.top = startY
                flexItem.left = startX
                startY+=flexItem.height
            }
        }else if(justifyContent === 'space-between'){
            let startX = flexline.startX || 0, startY = flexline.startY || 0;
            for (let index = 0; index < flexline.length; index++) {
                const flexItem = flexline[index];
                if(index!== 0){
                    startY+=oneLine.crossAxisRemainSpace/(oneLine.length -1)
                }
                flexItem.top = startY
                flexItem.left = startX
                startY+=flexItem.height
            }
        }else if(justifyContent === 'space-around'){
            let startX = flexline.startX || 0, startY = flexline.startY || 0;
            for (let index = 0; index < flexline.length; index++) {
                const flexItem = flexline[index];
                if(index === 0){
                    startY+=(flexline.crossAxisRemainSpace/(flexline.length))/2
                }else{
                    startY+=(flexline.crossAxisRemainSpace/(flexline.length))
                }
                flexItem.top = startY
                flexItem.left = startX
                startY+=flexItem.height
            }
        }else if(justifyContent === 'space-evenly'){
            let startX = flexline.startX || 0, startY = flexline.startY || 0;
            for (let index = 0; index < flexline.length; index++) {
                const flexItem = flexline[index];
                startY+=flexline.crossAxisRemainSpace/(flexline.length+1)
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

function alignFlexItems(flexLines,alignItems,axis){
    let sizeType = 'width',axisSize = 'mainSize',startPoint = 'left'
    if(axis === 'cross'){
        sizeType = 'height'
        axisSize = 'crossSize'
        startPoint = 'top'
    }
    for (const flexLine of flexLines) {
        for (const flexItem of flexLine) {
            const align = flexItem.alignSelf || alignItems
            if(align ==='flex-start'){
                    //do nothing
            }else if(align === 'flex-end'){
                if(flexItem[sizeType] !==  flexLine[axisSize]){
                    flexItem[startPoint] +=Math.abs(flexLine[axisSize] - flexItem[sizeType])
                }
            }else if(align === 'stretch'){
                //do nothing
            }else if(align === 'center'){
                if(flexItem[sizeType] !==  flexLine[axisSize]){
                    flexItem[startPoint] +=Math.abs(flexLine[axisSize] - flexItem[sizeType])/2
                }
            }
        }
    }
}

function paintFlexLines(flexLines,sideType){
    const opside = sideType === 'width' ?'height':'width'
    for (const flexLine of flexLines) {
        for (const flexItem of flexLine) {
            flexItem.domEl.style.top = `${flexItem.top}px`
            flexItem.domEl.style.left = `${flexItem.left}px`
            flexItem.domEl.style[sideType] = `${flexItem[sideType]}px`
            flexItem.domEl.style[opside] = `${flexItem[opside]}px`
        }
    }
}


const flexBtn = document.getElementById('flexBtn')
flexBtn.addEventListener('click',e=>{
    applyStyles(getFormSetting(),document.getElementById('cssImpl').getElementsByClassName('parent')[0])
    flexLayout(document.getElementById('jsImpl').getElementsByClassName('parent')[0],getFormSetting())
})

//render flexItem Settings
const flexItemSettings = document.getElementById('flexItemSettings')
const cssImpl = document.getElementById('cssImpl')
for (const child of cssImpl.children[0].children) {
    const div = document.createElement('div')
    const p = document.createElement('p')
    p.innerText = child.classList
    div.appendChild(p)
    const setting = document.createElement('div')
    const alignSelf = document.createElement('p')
    alignSelf.innerText = 'Align Self'
    setting.appendChild(alignSelf)
    const select = document.createElement('select')
    select.id = 'alignSelf'
    const innerHTML = `  <option value="flex-start">flex-start</option>
    <option value="flex-end">flex-end</option>
    <option value="stretch">stretch</option>
    <option value="center">center</option>`
    select.innerHTML = innerHTML
    
    setting.appendChild(select)

    const flex = document.createElement('p')
    flex.innerText = 'Flex'
    setting.appendChild(flex)
    const input = document.createElement('input')
    input.type = 'number'
    input.value = 0
    input.id = 'flex'
    setting.appendChild(input)

    const width = document.createElement('p')
    width.innerText = 'Width'
    setting.appendChild(width)
    const widthInput = document.createElement('input')
    widthInput.type = 'number'
    widthInput.value = Number((Math.random() * 100).toFixed(0))
    widthInput.id = 'width'
    setting.appendChild(widthInput)


    const height = document.createElement('p')
    height.innerText = 'Height'
    setting.appendChild(height)
    const heightInput = document.createElement('input')
    heightInput.type = 'number'
    heightInput.value = Number((Math.random() * 100).toFixed(0))
    heightInput.id = 'height'
    setting.appendChild(heightInput)

    div.appendChild(setting)
    flexItemSettings.appendChild(div)
}


function getFormSetting(){
    const form = document.getElementById('flexSetting')
    let count = 0;
    const items = []
    while (count <form.alignSelf.length) {
        items.push({
            alignSelf:form.alignSelf[count].value,
            flex:isNaN(Number(form.flex[count].value)) ? 0 : Number(form.flex[count].value),
            width:isNaN(Number(form.width[count].value)) ? 0 : Number(form.width[count].value),
            height: isNaN(Number(form.height[count].value)) ? 0 : Number(form.height[count].value),
        })
        count++
    }
    return {
        flexDirection:form.flexDirection.value,
        justifyContent:form.justifyContent.value,
        alignItems: form.alignItems.value,
        flexWrap:form.flexWrap.value,
        alignContent:form.alignContent.value,
        items
    }
}
applyStyles(getFormSetting(),document.getElementById('cssImpl').getElementsByClassName('parent')[0])
function applyStyles(flexStyles,container){
    container.style.display = 'flex'
    container.style.flexDirection = flexStyles.flexDirection
    container.style.justifyContent = flexStyles.justifyContent
    container.style.alignItems = flexStyles.alignItems
    container.style.flexWrap = flexStyles.flexWrap
    container.style.alignContent = flexStyles.alignContent
    for (let index = 0; index < container.children.length; index++) {
        const child = container.children[index];
        child.style.alignSelf= flexStyles.items[index].alignSelf
        child.style.flex= flexStyles.items[index].flex  ?flexStyles.items[index].flex :null

        child.style.width= isNaN(Number(flexStyles.items[index].width)) ? 0 : `${Number(flexStyles.items[index].width)}px` 
        child.style.height= isNaN(Number(flexStyles.items[index].height)) ? 0 : `${Number(flexStyles.items[index].height)}px` 


    }
}

flexLayout(document.getElementById('jsImpl').getElementsByClassName('parent')[0],getFormSetting())
