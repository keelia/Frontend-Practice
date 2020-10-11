import {TestExpression} from './test.js'
import {tokenize} from './Arithmetic-by-FSM.js'

TestExpression.map(item=>{
    calculate(item.input,document.getElementById('result'))
})

export function calculate(source,resultDOMContainer){
    
    if(source){
        const li = document.createElement('li')
        const title = document.createElement('p')
        title.classList.add('expression')
        title.innerText = source
        li.appendChild(title)
        try {
            const calculated = tokenize(source)
            const expected = eval(source)
            const resultIcon = Math.abs(calculated - expected) < Number.EPSILON ? '✅' :'❌'
           
            const content = document.createElement('p')
            content.classList.add('expression-result')
            content.innerText = `${resultIcon} Expect: ${calculated} to be ${expected}`
            
            li.appendChild(content)
            

        } catch (error) {
            const errContent = document.createElement('p')
            content.classList.add('expression-error')
            errContent.innerText = `${error.message}`
            li.appendChild(errContent)
        }
        resultDOMContainer.appendChild(li)

    }
}