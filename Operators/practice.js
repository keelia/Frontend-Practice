const operators = [
    {
        cat:'Update Operator',
        name:'Postfix Increment Operator',
        symbol:'++',
        combinDirection:'left',
        priority:0
    },
    {
        cat:'Update Operator',
        name:'Postfix Decrement Operator',
        symbol:'--',
        combinDirection:'left',
        priority:0
    },
    {
        cat:'Unary Operator',
        symbol:'delete',
        combinDirection:'left',
        priority:1
    },
    {
        cat:'Unary Operator',
        symbol:'void',
        combinDirection:'left',
        priority:1
    },
    {
        cat:'Unary Operator',
        symbol:'typeof',
        combinDirection:'left',
        priority:1
    },
    {
        cat:'Unary Operator',
        symbol:'+',
        combinDirection:'left',
        priority:1
    },
    {
        cat:'Unary Operator',
        symbol:'-',
        combinDirection:'left',
        priority:1
    },
    {
        cat:'Unary Operator',
        symbol:'~',
        combinDirection:'left',
        priority:1
    },
    {
        cat:'Unary Operator',
        symbol:'!',
        combinDirection:'left',
        priority:1
    },
    {
        name:'Exponentiation Operator',
        symbol:'**',
        combinDirection:'right',
        priority:2,
        example:`let a=3,b=2,c=5;
        console.log(a * b ** c)
        a=3,b=2,c=5;
        console.log((a * b ) ** c )
        a=3,b=2,c=5;
        console.log(a * (b ** c ))`
    },
    {
        cat:'Multiplicative Operator',
        symbol:'*',
        combinDirection:'left',
        priority:3
    },
    {
        cat:'Multiplicative Operator',
        symbol:'/',
        combinDirection:'left',
        priority:3
    },
    {
        cat:'Addtive Operator',
        symbol:'+',
        combinDirection:'left',
        priority:4
    },
    {
        cat:'Addtive Operator',
        symbol:'-',
        combinDirection:'left',
        priority:4,
        example:`let a=1,b=2,c=3;
        console.log(a >> b+c )
        a=1,b=2,c=3;
        console.log((a >> b ) +c )
        a=1,b=2,c=3;
        console.log(a >> (b + c ))`
    },
    {
        cat:'Bitwise Shit Operator',
        symbol:'>>',
        combinDirection:'left',
        priority:5,
        example:`let a=1,b=2,c=3;
        console.log(a >> 1 >=b )
        a=1,b=2,c=3;
        console.log((a >>1 ) >=b )
        a=1,b=2,c=3;
        console.log(a >> (1 >=b ))`
    },
    {
        cat:'Bitwise Shit Operator',
        symbol:'<<',
        combinDirection:'left',
        priority:5
    },
    {
        cat:'Bitwise Shit Operator',
        symbol:'>>>',
        combinDirection:'left',
        priority:5
    },
    {
        cat:'Relational Operator',
        symbol:'>',
        combinDirection:'left',
        priority:6
    },
    {
        cat:'Relational Operator',
        symbol:'<',
        combinDirection:'left',
        priority:6
    },
    {
        cat:'Relational Operator',
        symbol:'>=',
        combinDirection:'left',
        priority:6
    },
    {
        cat:'Relational Operator',
        symbol:'<=',
        combinDirection:'left',
        priority:6
    },
    {
        cat:'Relational Operator',
        symbol:'instance of',
        combinDirection:'left',
        priority:6
    },
    {
        cat:'Relational Operator',
        symbol:'in',
        combinDirection:'left',
        priority:6
    },
    {
        cat:'Equaility Operator',
        symbol:'==',
        combinDirection:'left',
        priority:7,
        example:`let a=1,b=2,c=2;
        console.log(a == b^1)
        a=1,b=2,c=2;
        console.log((a == b)^1)
        a=1,b=2,c=2;
        console.log(a == (b^1))`
    },
    {
        cat:'Equaility Operator',
        symbol:'===',
        combinDirection:'left',
        priority:7
    },
    {
        cat:'Equaility Operator',
        symbol:'!=',
        combinDirection:'left',
        priority:7
    },
    {
        cat:'Binary Bitwise Operator',
        symbol:'&',
        combinDirection:'left',
        priority:8
    },
    {
        cat:'Binary Bitwise Operator',
        symbol:'|',
        combinDirection:'left',
        priority:8
    },
    {
        cat:'Binary Bitwise Operator',
        symbol:'^',
        combinDirection:'left',
        priority:8,
        example:`let a=1,b=2,c=2;
        console.log(a || b^1)
        a=1,b=2,c=2;
        console.log((a || b)^1)
        a=1,b=2,c=2;
        console.log(a || (b^1))`
    },
    {
        cat:'Binary Logical Operator',
        symbol:'&&',
        combinDirection:'left',
        priority:9,
    },
    {
        cat:'Binary Logical Operator',
        symbol:'||',
        combinDirection:'left',
        priority:9,
        example:`let a=1,b=false,c=2;
        console.log(a || b ? false:true)
        a=1,b=false,c=2;
        console.log((a || b) ? false:true)
        a=1,b=false,c=2;
        console.log(a ||( b ? false:true))`
    },
    {
        cat:'Conditional Operator',
        symbol:'?:',
        combinDirection:'left',
        priority:10,
        example:`let a=1,b=2,c=2;
        console.log(a+=3 ? b:c)
        a=1,b=2,c=2;
        console.log(a+=(3 ? b:c))
        a=1,b=2,c=2;
        console.log((a+=3) ? b:c)`
    },
    {
        cat:'Assignment Operator',
        symbol:'+=',
        combinDirection:'left',
        priority:11
    },
    {
        cat:'Assignment Operator',
        symbol:'-=',
        combinDirection:'left',
        priority:11
    },
    {
        cat:'Assignment Operator',
        symbol:'*=',
        combinDirection:'left',
        priority:11
    },
    {
        cat:'Assignment Operator',
        symbol:'/=',
        combinDirection:'left',
        priority:11
    },
    {
        cat:'Assignment Operator',
        symbol:'%=',
        combinDirection:'left',
        priority:11
    },
    {
        cat:'Assignment Operator',
        symbol:'<<=',
        combinDirection:'left',
        priority:11
    },
    {
        cat:'Assignment Operator',
        symbol:'>>=',
        combinDirection:'left',
        priority:11
    },
    {
        cat:'Assignment Operator',
        symbol:'>>>=',
        combinDirection:'left',
        priority:11
    },
    {
        cat:'Assignment Operator',
        symbol:'&=',
        combinDirection:'left',
        priority:11
    },
    {
        cat:'Assignment Operator',
        symbol:'^=',
        combinDirection:'left',
        priority:11
    },
    {
        cat:'Assignment Operator',
        symbol:'|=',
        combinDirection:'left',
        priority:11
    },
    {
        cat:'Assignment Operator',
        symbol:'**=',
        combinDirection:'left',
        priority:11
    },
    {
        cat:'Comma Operator',
        symbol:',',
        combinDirection:'left',
        priority:12
    }
];

const tbody = document.getElementById('content');
operators.map(operator=>{
    const row = document.createElement('tr');
    ['cat','name','symbol','combinDirection','priority','example'].map(id=>{
        const td= document.createElement('td');
        td.innerText = operator[id] === undefined ? '' : operator[id] 
        row.appendChild(td)
    })
    tbody.appendChild(row)
})

