
function $(simpleSelector,styles){//htc
    console.log(simpleSelector)
    simpleSelector = simpleSelector.trim()
    //tag,class,id,attr
    let cssStack = []
    let top
    let state = start
    for (const c of simpleSelector) {
        state = state(c)
    }

    function start(c){
        if(c === '*'){
            return universalCollection(c)
        }else if(c === '.'){
            return classCollectionStart
        }else if(c === '['){
            return attrCollectionStart
        }else if(c==='#'){
            return idCollectionStart
        }else if(/[a-z]/.test(c)){
            return tagCollectionStart(c)
        }else if(/\s/.test(c)){
            cssStack.push({})
            return spaceConsume
        }else{
            return start
        }
    }
    function universalCollection(c){
        top = cssStack[cssStack.length-1]
        if(top){
            top.universal = c
        }else{
            top = {
                universal:c
            }
            cssStack.push(top)
        }
        return start
    }

    function spaceConsume(c){
        if(/\s/.test(c)){
            return spaceConsume
        }else{
            return start(c)
        }
    }

    function tagCollectionStart(c){
        top = cssStack[cssStack.length-1]
        if(top){
            top.tagName = c
        }else{
            top = {
                tagName:c
            }
            cssStack.push(top)
        }
        return tagCollection
    }

    function tagCollection(c){
        if(/[a-z1-9A-Z]/.test(c)){
            top.tagName +=c
            return tagCollection
        }else{
            return start(c)
        }
    }

    function idCollectionStart(c){
        top = cssStack[cssStack.length-1]
        if(top){
            top.idName = c
        }else{
            top = {
                idName:c
            }
            cssStack.push(top)
        }
        return idCollection
    }

    function idCollection(c){
        if(/[a-z1-9]/.test(c)){
            top.idName +=c
            return idCollection
        }else{
            return start(c)
        }
    }

    function classCollectionStart(c){
        top = cssStack[cssStack.length-1]
        if(top){
            if(top.classes && top.classes.length){
                top.classes.push(c)
            }else{
                top.classes = [c]
            }
        }else{
            top = {
                classes:[c]
            }
            cssStack.push(top)
        }
        return classCollection
    }

    function classCollection(c){
        if(/[a-z1-9-]/.test(c)){
            top.classes[top.classes.length-1]+=c
            return classCollection
        }else{
            return start(c)
        }
    }


    function attrCollectionStart(c){
        if(/[*$\^~|=]/.test(c)){
            return attrOperatorCollection(c)
        }else if(c === ']'){
            return start
        }else{
            top = cssStack[cssStack.length-1]
            if(top){
                if(top.attrs && top.attrs.length){
                    top.attrs.push({
                        name:c,
                        value:'',
                        operator:'',
                        caseSensitive:true
                    })
                }else{
                    top.attrs = [{
                        name:c,
                        value:'',
                        operator:'',
                        caseSensitive:true
                    }]
                }
            }else{
                top = {
                    attrs: [{
                        name:c,
                        value:'',
                        operator:'',
                        caseSensitive:true
                    }]
                }
                cssStack.push(top)
            }
            return attrNameCollection
        }
    }

    function attrNameCollection(c){
        if(/[*$\^~|=]/.test(c)){
            return attrOperatorCollection(c)
        }else if(c === ']'){
            return start
        }else{
            top = cssStack[cssStack.length-1]
            top.attrs[top.attrs.length-1].name+=c
            return attrNameCollection
        }
    }

    function attrOperatorCollection(c){
        if(/[*$\^~|=]/.test(c)){
            top.attrs[top.attrs.length-1].operator+=c
            return attrOperatorCollection
        }else{
            return attrValueCollectionStart(c)
        }
    }
    function attrValueCollectionStart(c){
        console.log('attrValueCollectionStart',c)
        if(c === ']'){
            return start
        }else if(/["']/.test(c)){
            return attrValueCollection
        }else if(/[si]/.test(c)){
            top.attrs[top.attrs.length-1].caseSensitive = c === 's'
            return attrValueCollectionStart
        }else if(c === ' '){
            return attrValueCollectionStart
        }else{
            return start
        }
    }
    function attrValueCollection(c){
        if(/["']/.test(c)){
            return attrValueCollectionStart
        }else{
            top.attrs[top.attrs.length-1].value+=c
            return attrValueCollection
        }
    }
    //find element
    // console.log(cssStack)
    let cssTree = {  }
    for (let index = 0; index < cssStack.length; index++) {
        const cssNode = cssStack[index];
        if(cssTree.children){
            //find parent
            let parent = cssTree
            while (parent.deepth !== index-1) {
                parent = cssTree.children[0]
            }
            parent.children = {
                cssNode,
                deepth:index,
                children:null,
                nodes:getEls(cssNode)
            }
        }else{
            cssTree = {
                cssNode,
                deepth:index,
                children:null,
                nodes:getEls(cssNode)
            }
        }
    }
    // console.log(cssTree)
    let cssNode = cssTree
    let els = cssNode.nodes
    while (cssNode) {
        els = cssNode.nodes
        cssNode = cssNode.children
    }
    // console.log('seleted els',els)
    //paint
    for (let index = 0; index < els.length; index++) {
        const element = els[index];
        Object.keys(styles).map(styleKey=>{
            element.style[styleKey] = styles[styleKey]
        })
        
    }
    return els
}
function splice(els,elIndexes){
    // console.log('remove',els,elIndexes)
    let ret = []
    for (let index = 0; index < els.length; index++) {
        const element = els[index];
        if(elIndexes.some(elIndex=>elIndex === index)){
            continue
        }
        ret.push(element)

    }
    return ret
}
function getEls(cssNode){
    let els
    Object.keys(cssNode).map(prop=>{
        if(els){
            const removeIndexes = []
            console.log(els)
            for (let index = 0; index < els.length; index++) {
                const selectedEl = els[index];
                if(prop === 'idName'){
                    if(selectedEl.id !== cssNode[prop]){
                        removeIndexes.push(index)
                    }
                }else if(prop === 'classes'){
                    for (const cls of cssNode.classes) {
                        if(!selectedEl.classList.contains(cls)){
                            removeIndexes.push(index)
                        }
                    }
                }else if(prop === 'tagName'){
                    if(selectedEl.tagName !== cssNode[prop].toUpperCase()){
                        removeIndexes.push(index)
                    }else{
                        console.log('keep me',selectedEl)
                    }
                }else if(prop === 'attrs'){
                    for (const attr of cssNode[prop]) {
                        if(!selectedEl.getAttribute(attr.name)){
                            removeIndexes.push(index)
                        }else{
                            //check operator
                            const attrValue = selectedEl.getAttribute(attr.name)
                            // console.log(attr.name,attrValue,attr.operator,attr.caseSensitive,attrValue)
                            if(attr.operator === '='){
                                if(attr.caseSensitive){
                                    if(attrValue !== attr.value){
                                        removeIndexes.push(index)
                                    }
                                }else{
                                    if(attrValue.toLowerCase() !== attr.value.toLowerCase()){
                                        removeIndexes.push(index)
                                    }
                                }
                                
                            }else if(attr.operator === '~='){
                                const reg = new RegExp(`[\s\S]${attr.value}[\s\S]`,attr.caseSensitive ? '':'i')
                                if(!reg.test(attrValue)){
                                    removeIndexes.push(index)
                                }

                            }else if(attr.operator === '|='){
                                const reg = new RegExp(`${attr.value}[-\s]`,attr.caseSensitive ? '':'i')
                                if(!reg.test(attrValue)){
                                    removeIndexes.push(index)
                                }
                            }else if(attr.operator === '*='){
                                const reg = new RegExp(attr.value,attr.caseSensitive ? '':'i')
                                if(!reg.test(attrValue)){
                                    removeIndexes.push(index)
                                }else{
                                    console.log('keep me',index)
                                }
                            }else if(attr.operator === '$='){
                                const reg = new RegExp(`${attr.value}$`,attr.caseSensitive ? '':'i')
                                if(!reg.test(attrValue)){
                                    removeIndexes.push(index)
                                }
                            }else if(attr.operator === '^='){
                                const reg =  new RegExp(`^${attr.value}`,attr.caseSensitive ? '':'i')
                                if(!reg.test(attrValue)){
                                    removeIndexes.push(index)
                                }
                            }
                        }
                    }
                }
            }
            els = splice(els,Array.from(new Set(removeIndexes)))
        }else{
            if(prop === 'idName'){
                els = document.getElementById(cssNode.idName) ?   [document.getElementById(cssNode.idName)]  : []
            }else if(prop === 'classes'){
                els =  document.getElementsByClassName(cssNode.classes.join(' '))
            }else if(prop === 'tagName'){
                els = document.getElementsByTagName(cssNode.tagName)
            }else if(prop === 'attrs'){
                els = document.body.childNodes
                const removeIndexes = []
                for (const attr of cssNode[prop]) {
                    if(!selectedEl.getAttribute(attr.name)){
                        removeIndexes.push(index)
                    }else{
                        //check operator
                        const attrValue = selectedEl.getAttribute(attr.name)
                        if(attr.operator === '='){
                            if(attrValue !== attr.value){
                                removeIndexes.push(index)
                            }
                        }else if(attr.operator === '~='){
                            const reg = new RegExp(`[\s\S]${attr.value}[\s\S]`,attr.caseSensitive ? '':'i')
                            if(!reg.test(attrValue)){
                                removeIndexes.push(index)
                            }

                        }else if(attr.operator === '|='){
                            const reg = new RegExp(`${attr.value}[-\s]`,attr.caseSensitive ? '':'i')
                            if(!reg.test(attrValue)){
                                removeIndexes.push(index)
                            }
                        }else if(attr.operator === '*='){
                            const reg = new RegExp(attr.value,attr.caseSensitive ? '':'i')
                            console.log(reg.source)
                            if(!reg.test(attrValue)){
                                removeIndexes.push(index)
                            }
                        }else if(attr.operator === '$='){
                            const reg = new RegExp(`${attr.value}$`,attr.caseSensitive ? '':'i')
                            if(!reg.test(attrValue)){
                                removeIndexes.push(index)
                            }
                        }else if(attr.operator === '^='){
                            const reg = new RegExp(`^${attr.value}`,attr.caseSensitive ? '':'i')
                            if(!reg.test(attrValue)){
                                removeIndexes.push(index)
                            }
                        }
                    }
                }
                splice(els,Array.from(new Set(removeIndexes)))
            }else if(prop === 'universal'){
                function getChildrenNodes(root){
                    let ret = []
                    for (const child of root.children) {
                        if(child.tagName!=='SCRIPT'){
                            ret.push(child,...getChildrenNodes(child))
                        }
                    }
                    return ret
                }
                els = getChildrenNodes(document.body)
            }
        }
    })
    return els
}

const cases = [
    {
        selector:'a',
        styles:{
            color: 'red'
        }
    }, {
        selector:'.red',
        styles:{
            color: '#f33'
        }
    }, {
        selector:'.yellow-bg ',
        styles:{
            backgroundColor: '#ffa'
        }
    }, {
        selector:'.fancy',
        styles:{
            fontWeight: 'bold',
            textShadow:'4px 4px 3px #77f'
        }
    }, {
        selector:'#identified ',
        styles:{
            backgroundColor: 'skyblue'
        }
    }, {
        selector:'a[href^="https"][href$=".org"]',
        styles:{
            color: 'green'
        }
    }, {
        selector:'a[href*="cAsE" s]',
        styles:{
            color: 'pink'
        }
    }, {
        selector:'a[href*="cAsE" i]',
        styles:{
            color: 'pink'
        }
    }, {
        selector:'a[href*="insensitive" i]',
        styles:{
            color: 'cyan'
        }
    }, {
        selector:'a[href*="example"]',
        styles:{
            backgroundColor: 'silver'
        }
    }, {
        selector:'a[href^="#"]',
        styles:{
            backgroundColor: 'gold'
        }
    }, {
        selector:'*',
        styles:{
            fontSize: '28px'
        }
    },{
        selector:'*[href*="example"]',
        styles:{
            color: 'red'
        }
    },{
        selector:'* span',
        styles:{
            color: 'green'
        }
    },{
        selector:'ul li a',
        styles:{
            color: 'green'
        }
    }]

    // let index = 14
    // console.log($(cases[index].selector,cases[index].styles))
for (const test of cases) {
    console.log($(test.selector,test.styles))
}
