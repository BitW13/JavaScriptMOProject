let expr=document.getElementById('expr'),
	xZero=document.getElementById('zeroX'),
	stepInput=document.getElementById('step'),
	yourFunction=document.getElementById('function'),
    intervalInput=document.getElementById('intervalInput'),
	parenthesis='keep';


doBeginning(expr.value, xZero.value, stepInput.value);

function doBeginning(expression, x0, step){
	expr.value=expression;
	xZero.value=x0;
	stepInput.value=step;
	variables = getVariables();
    console.log(variables);
    
	interval=getInterval(expression, x0, step);
    intervalInput.innerHTML="["+interval[0]+", "+interval[1]+"]";

}
function setFunction(element, value){
	//alert('$$'+math.parse(value).toTex({parenthesis: parenthesis})+'$$');
	element.innerHTML = '$$' + math.parse(value).toTex({parenthesis: parenthesis}) + '$$';
}
function getVariables() {
    var nodeExpr = math.parse(expr.value);
    console.log(nodeExpr.toString());
    var filtered = nodeExpr.filter(function (node) {
        return node.isSymbolNode
    });
    filtered = unique(filtered);
    return filtered;
}
function unique(arr) {
    var obj = {};

    for (var i = 0; i < arr.length; i++) {
        var str = arr[i];
        obj[str] = true; // запомнить строку в виде свойства объекта
    }

    return Object.keys(obj); // или собрать ключи перебором для IE8-
}
function getInterval(expression, x0, step){
	node=math.parse(expression);
    code=node.compile();
    f1=code.eval({x:x0-step});
    f2=code.eval({x:x0});
    f3=code.eval({x:x0+step});
    a0=0;
    b0=0;
    if(f1>=f2 && f2<=f3){
        return [x0-step, x0+step];
    }
    else if(f1<=f2 && f2>=f3){
        return ["none", "none"];
    }
    else{
        k=0;
        xs=[];
        xs[0]=x0;
        d=0;
        if(f1>=f2 && f2>=f3){//4
            d=step;
            a0=x0;
            xs[1]=x0+step;
            k=1;
        }
        if(f1<=f2 && f2<=f3){
            d=-step;
            b0=x0;
            xs[1]=x0-step;
            k=1;
        }
        while(true){
            xs[k+1]=xs[k]+Math.pow(2,k)*d;//5


            if(code.eval({x:xs[k+1]})<code.eval({x:xs[k]})){
                if(d==step){
                    a0=xs[k];
                    k++;
                }
                if(d==-step){
                    b0=xs[k];
                    k++;
                }
            }
            else{
                if(d==step){
                    b0=xs[k+1];
                }
                if(d==-step){
                    a0=xs[k+1]
                }
                interval=[a0, b0];
                return interval;
            } 
        }       
        
    }
}