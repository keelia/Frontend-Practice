/**
 * 1. Define Arithmetic by BNF
 * <Expression>:: = <AdditiveExpression><EOF>
 * <AdditiveExpression>::= <MultiplicativeExpression> | 
 *                          <AdditiveExpression> + <MultiplicativeExpression> |
 *                          <AdditiveExpression> - <MultiplicativeExpression>
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

const num = ['0','1','2','3','4','5','6','7','8','9','.']
const oper = ['+','-','*','/']
const groupingOper = ['(',')']
const other = ['\u0020','\u000A','\u000D']
const eof = Symbol('EOF')
const tokens = []
const tokenStack = []
const validTokenType = ['Decimal','Operator','Grouping Operator']

export function tokenize(source){
    console.log('Source',source)
    let state = start
    for (const char of source) {
        state = state(char)
    }
    state(eof)
    // console.log(tokenStack)
    const ast = Expression(tokenStack)
    tokenStack.length = 0
    // console.log(ast)
    return evaluate(ast)
}

function isDecimal(str){
    const reg = /^-?([0-9]|[1-9][0-9]+)?(.[0-9]+)?$/
    return reg.test(str)
}
function start(c){
    if(num.some(item=>item === c)){
        tokens.push(c)
        return onNumber
    }else if(oper.some(op=>op===c)){
        const previousToken = tokenStack[tokenStack.length-1]
        if(previousToken){
            if(previousToken.type === validTokenType[1]){
                throw(new Error('Expression Syntax Error: Not a valid expression'))
            }else if(previousToken.type === validTokenType[2] && previousToken.value === groupingOper[0]){
                if((c === oper[0] ) || (c === oper[2] )|| (c === oper[3])){
                    throw(new Error('Expression Syntax Error: Not a valid expression'))
                }
            }
            
        }
        if(c === '-'){
            if(!previousToken || (previousToken.type === validTokenType[2])){
                tokens.push(c)
                return onNumber
            }
        }
        emitToken({
            type:'Operator',
            value:c
        })
        return start
    }else if(groupingOper.some(op=>op===c)){
        emitToken({
            type:'Grouping Operator',
            value:c
        })
        return start
    }else if(other.some(ot=>ot === c)){
        return start
    }else if(c === eof){
        emitToken({
            type:eof
        })
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
    tokenStack.push(token)
}
/**
 * 3. Syntax Analisis: LL
 * write function regards BNF
 */

 function PrimaryExpression(source){
    // console.log('PrimaryExpression',JSON.stringify(source))
    // debugger
    if(source[0].value === groupingOper[0]){//(
        let node = {
            type:'PrimaryExpression',
            children:[source.shift()]
        }

        AdditiveExpression(source)
        node.children.push(source.shift())
        node.children.push(source.shift())
        source.unshift(node)
        return PrimaryExpression(source)
    }
    if(source[0].type === 'PrimaryExpression'){
        return source[0]
    }
 }
function AdditiveExpression(source){
/* <AdditiveExpression>::= <MultiplicativeExpression> | 
                           <AdditiveExpression> + <MultiplicativeExpression> |
                           <AdditiveExpression> - <MultiplicativeExpression> */
//    console.log('AdditiveExpression',JSON.stringify(source))
//    debugger
   if(source[0].value === groupingOper[0]){//(
        PrimaryExpression(source)
        return AdditiveExpression(source)
    }
   if(source[0].type === 'MultiplicativeExpression'){
        let node = {
            type:'AdditiveExpression',
            children:[source[0]]
        }
        source[0] = node
        return AdditiveExpression(source)
    }else if((source[0].type === 'AdditiveExpression' || source[0].type === 'PrimaryExpression') && source[1] && source[1].value === '+'){
        let node = {
            type:'AdditiveExpression',
            operator:'+',
            children:[source.shift(),source.shift()]
        }
        MultiplicativeExpression(source)
        node.children.push(source.shift())
        source.unshift(node)
        return AdditiveExpression(source)
    }else if((source[0].type === 'AdditiveExpression' || source[0].type === 'PrimaryExpression') && source[1] && source[1].value === '-'){
        let node = {
            type:'AdditiveExpression',
            operator:'-',
            children:[source.shift(),source.shift()]
        }
       
        MultiplicativeExpression(source)
        node.children.push(source.shift())
        source.unshift(node)
        return AdditiveExpression(source)
    }
    if(source[0].type === 'AdditiveExpression'){
        return source[0]
    }
    MultiplicativeExpression(source)
    return AdditiveExpression(source)
}

function MultiplicativeExpression(source){
/** 
* <MultiplicativeExpression>:: = <Decimal> | 
*                                 <MultiplicativeExpression> * <Decimal>
*                                  <MultiplicativeExpression> / <Decimal>
*/ 
    // console.log('MultiplicativeExpression',JSON.stringify(source))
    // debugger
    if(source[0].value === groupingOper[0]){//(
        PrimaryExpression(source)
        return MultiplicativeExpression(source) 
    }
    if(source[0].type === validTokenType[0]){//Decimal
        let node = {
            type:'MultiplicativeExpression',
            children:[source[0]]
        }
        source[0] = node
        return MultiplicativeExpression(source)
    }else if((source[0].type === 'MultiplicativeExpression' || source[0].type === 'PrimaryExpression') && source[1].value === '*'){
        let node = {
            type:'MultiplicativeExpression',
            operator:'*',
            children:[source.shift(),source.shift()]
        }
        if(source[0].value === groupingOper[0]){
            PrimaryExpression(source)
        }else{
            MultiplicativeExpression(source)
        }
        node.children.push(source.shift())
        source.unshift(node)
        return MultiplicativeExpression(source)
    }else if((source[0].type === 'MultiplicativeExpression' || source[0].type === 'PrimaryExpression') && source[1].value === '/'){
        let node = {
            type:'MultiplicativeExpression',
            operator:'/',
            children:[source.shift(),source.shift()]
        }
        if(source[0].value === groupingOper[0]){
            PrimaryExpression(source)
        }else{
            MultiplicativeExpression(source)
        }
        node.children.push(source.shift())
        source.unshift(node)
        return MultiplicativeExpression(source)
    }
    if(source[0].type === 'MultiplicativeExpression'){
        return source[0]
    }
    if(source[0].type === 'PrimaryExpression'){
        return source[0]
    }
    return MultiplicativeExpression(source)
}

function Expression(source){
    if((source[0].type === 'AdditiveExpression') && source[1] && source[1].type === eof){
        let node = {
            type:'Expression',
            children:[source.shift(),source.shift()]
        }
        source.unshift(node)
        return node
    }else   if((source[0].type === 'PrimaryExpression') && source[1] && source[1].type === eof){
        let node = {
            type:'Expression',
            children:[source.shift(),source.shift()]
        }
        source.unshift(node)
        return node
    }
    else if((source[0].value === groupingOper[0])){
        PrimaryExpression(source)
        return Expression(source)
    }
    AdditiveExpression(source)
    return Expression(source)
}
/**
 * 4. eval
 */
function evaluate(node){
    if(node.type === 'Expression'){
        return evaluate(node.children[0])
    }
    if(node.type === 'AdditiveExpression'){
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
    if(node.type === 'PrimaryExpression'){
        return (evaluate(node.children[1]))
    }
    if(node.type === validTokenType[0]){
        return Number(node.value)
    }
 }
