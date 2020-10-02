/**
 * 1. Define Arithmetic by BNF
 * <Expression>:: = <AddictiveExpression><EOF>
 * <AddictiveExpression>::= <MultiplicativeExpression> | 
 *                          <AddictiveExpression> + <MultiplicativeExpression> |
 *                          <AddictiveExpression> - <MultiplicativeExpression>
 * <MultiplicativeExpression>:: = <Decimal> | 
 *                                 <MultiplicativeExpression> * <Decimal>
 *                                 <MultiplicativeExpression> / <Decimal>
 * <Decimal>:: = [0-9] | [1-9][0-9]?.[0-9]?
 */

 /**
  * 2. Lexical Analysis : Convert string stream to token stream
  * Token: Decimal | Operator
  * Whitespace :<SP>
  * Lineterminator:<LF><CR>
  * Method:1.FSM 2. Reg
  */
const tests = [
    {
        input:'-10.24 + 2 + 256 / 2',
        expect:(-10.24 + 2 + 256 / 2)
    }
]
const num = ['0','1','2','3','4','5','6','7','8','9','.']
const oper = ['+','-','*','/']
const other = ['\u0020','\u000A','\u000D']
const eof = Symbol('EOF')
const tokens = []
const tokenStack = []
const validTokenType = ['Decimal','Operator']

function tokenize(source){
    let state = start
    for (const char of source) {
        state = state(char)
    }
    state(eof)

    const ast = Expression(tokenStack)
    tokenStack.length = 0
    
    return evaluate(ast)
}

tests.map(item=>{
    console.log('Exprect : ',tokenize(item.input), 'To be :', item.expect)
})

function isDecimal(str){
    const reg = /^([0-9]|[1-9][0-9]+)?(.[0-9]+)?$/
    return reg.test(str)
}
function start(c){
    if(num.some(item=>item === c)){
        tokens.push(c)
        return onNumber
    }else if(oper.some(op=>op===c)){
        emitToken({
            type:'Operator',
            value:c
        })
        return start
    }else if(other.some(ot=>ot === c)){
        return start
    }
}

function onNumber(c){
    if(num.some(item=>item === c)){
        tokens.push(c)
        return onNumber
    }else if(c === eof){
        if(tokens.length>0){
            emitToken({
                type:'Decimal',
                value:tokens.join('')
            })
            tokens.length = 0
        }
        emitToken({
            type:eof
        })
    }else{
        emitToken({
            type:'Decimal',
            value:tokens.join('')
        })
        tokens.length = 0
        return start(c)
    }
}


function emitToken(token){
    if(token.type === 'Decimal'){
        const isValidDecimal = isDecimal(token.value)
        if(!isValidDecimal){
            throw(new Error('TypeError: Not a valid decimal'))
        }
    }
    if(token.value === oper[1] && (!tokenStack || tokenStack.length == 0)){
        tokenStack.push({type:'Decimal',value:'0'})
    }
    tokenStack.push(token)
}
/**
 * 3. Syntax Analisis: LL
 * write function regards BNF
 */
function AddictiveExpression(source){
/* <AddictiveExpression>::= <MultiplicativeExpression> | 
                           <AddictiveExpression> + <MultiplicativeExpression> |
                           <AddictiveExpression> - <MultiplicativeExpression> */
   // console.log('AddictiveExpression',source)
    if(source[0].type === 'MultiplicativeExpression'){
        let node = {
            type:'AddictiveExpression',
            children:[source[0]]
        }
        source[0] = node
        return AddictiveExpression(source)
    }else if(source[0].type === 'AddictiveExpression' && source[1].value === '+'){
        let node = {
            type:'AddictiveExpression',
            operator:'+',
            children:[source.shift(),source.shift()]
        }
        MultiplicativeExpression(source)
        node.children.push(source.shift())
        source.unshift(node)
        return AddictiveExpression(source)
    }else if(source[0].type === 'AddictiveExpression' && source[1].value === '-'){
        let node = {
            type:'AddictiveExpression',
            operator:'-',
            children:[source.shift(),source.shift()]
        }
        MultiplicativeExpression(source)
        node.children.push(source.shift())
        source.unshift(node)
        return AddictiveExpression(source)
    }
    if(source[0].type === 'AddictiveExpression'){
        return source[0]
    }
    MultiplicativeExpression(source)
    return AddictiveExpression(source)
}

function MultiplicativeExpression(source){
/** 
* <MultiplicativeExpression>:: = <Decimal> | 
*                                 <MultiplicativeExpression> * <Decimal>
*                                  <MultiplicativeExpression> / <Decimal>
*/ 
//console.log('MultiplicativeExpression',source)
    if(source[0].type === validTokenType[0]){
        let node = {
            type:'MultiplicativeExpression',
            children:[source[0]]
        }
        source[0] = node
        return MultiplicativeExpression(source)
    }else if(source[0].type === 'MultiplicativeExpression' && source[1].value === '*'){
        let node = {
            type:'MultiplicativeExpression',
            operator:'*',
            children:[source.shift(),source.shift()]
        }
        MultiplicativeExpression(source)
        node.children.push(source.shift())
        source.unshift(node)
        return MultiplicativeExpression(source)
    }else if(source[0].type === 'MultiplicativeExpression' && source[1].value === '/'){
        let node = {
            type:'MultiplicativeExpression',
            operator:'/',
            children:[source.shift(),source.shift()]
        }
        MultiplicativeExpression(source)
        node.children.push(source.shift())
        source.unshift(node)
        return MultiplicativeExpression(source)
    }
    if(source[0].type === 'MultiplicativeExpression'){
        return source[0]
    }
    return MultiplicativeExpression(source)
}

function Expression(source){
    //<Expression>:: = <AddictiveExpression><EOF>
    if(source[0].type === 'AddictiveExpression' && source[1] && source[1].type === eof){
        let node = {
            type:'Expression',
            children:[source.shift(),source.shift()]
        }
        source.unshift(node)
        return node
    }
    AddictiveExpression(source)
    return Expression(source)
}
/**
 * 4. eval
 */

 function evaluate(node){
    if(node.type === 'Expression'){
        return evaluate(node.children[0])
    }
    if(node.type === 'AddictiveExpression'){
        if(node.operator === oper[0]){//+
            return evaluate(node.children[0]) + evaluate(node.children[2])
        }
        if(node.operator === oper[1]){//-
            return evaluate(node.children[0]) - evaluate(node.children[2])
        }
        return evaluate(node.children[0])
    }
    if(node.type === 'MultiplicativeExpression'){
        if(node.operator === oper[2]){// *
            return evaluate(node.children[0]) * evaluate(node.children[2])
        }
        if(node.operator === oper[3]){// /
            return evaluate(node.children[0]) / evaluate(node.children[2])
        }
        return evaluate(node.children[0])
    }
    if(node.type === validTokenType[0]){
        return Number(node.value)
    }
 }