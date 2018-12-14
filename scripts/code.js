let expr=document.getElementById('expr'),
	xZero=document.getElementById('zeroX'),
	stepInput=document.getElementById('step'),
	accuracy = document.getElementById('accuracy'),
	yourFunction=document.getElementById('function'),
    intervalInput=document.getElementById('intervalInput'),
    xMinInput = document.getElementById('xMinInput'),
    xMaxInput=document.getElementById('xMaxInput'),
    xExtremumFiboInput = document.getElementById('xExtremumFiboInput'),
	parenthesis='keep',
	implicit ='hide';

doBeginning(expr.value, xZero.value, stepInput.value, accuracy.value);

function doBeginning(expression, x0, step, accuracy){
	expr.value=expression;
	xZero.value=x0;
	stepInput.value=step;
	accuracy.value = accuracy;

    setFunction(yourFunction, expr.value);
    
	var interval = setInterval(expression, x0, step);

    setExtremums(expression, interval[0], interval[1], accuracy);
}

function restart() {
    doBeginning(expr.value, xZero.value, stepInput.value, accuracy.value);
}

function setFunction(element, value) {
	element.innerHTML = '$$' + math.parse(value).toTex({parenthesis: parenthesis}) + '$$';
}

function setInterval(expression, x0, step) {
    interval=getInterval(expression, x0, step);
    if(interval == ["none", "none"]){
        document.getElementById("resultFunc").innerHTML = "Минимум не найден";
        return null;
    }
    else{
        intervalInput.innerHTML="["+interval[0]+", "+interval[1]+"]";
        document.getElementById("resultFunc").innerHTML = "Минимум найден";
    return interval;
    }    
}

function setExtremums(expression, interval1, interval2, accuracy) {
    var xMin = getGoldenRatioMin(expression,interval1,interval2,accuracy);
    xMinInput.innerHTML=xMin;

    var xMax = getGoldenRatioMax(expression,interval1,interval2,accuracy);
    xMaxInput.innerHTML=xMax;

    xMin = getFibonacciExtremum(expression,interval1,interval2,accuracy);
    xExtremumFiboInput.innerHTML = xMin;
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

function getGoldenRatioMin(expression, interval1, interval2, accuracy) {
	var eps = accuracy;
	node=math.parse(expression);
    code=node.compile();
    var a= interval1;
    var b= interval2;
	var q = (3-Math.sqrt(5))/2;
	var x1 = a+q*(b-a);
	var x2 = b-q*(b-a);
	var A = code.eval({x:x1});
	var B = code.eval({x:x2});
	while(b-a>eps){
		if(A<B){
			b = x2;
			x2 = x1;
			B = A;
			x1 = a+(1-q)*(b-a);
			A = code.eval({x:x1});
		}else{
			a = x1;
			x1 = x2; 
			A = B; 
			x2 = b-(1-q)*(b-a); 
			B = code.eval({x:x2}); 
		}
	}
	var x = (a+b)/2;
	x = Math.abs(x)<accuracy ? 0:x;
	return x;
}

function getGoldenRatioMax(expression, interval1, interval2, accuracy) {
	var eps = accuracy;
	node=math.parse(expression);
    code=node.compile();
    var a= interval1;
    var b= interval2;
	var q = (3-Math.sqrt(5))/2;
	var x1 = a+q*(b-a);
	var x2 = b-q*(b-a);
	var A = code.eval({x:x1});
	var B = code.eval({x:x2});
	while(b-a>eps){
		if(A>B){
			b = x2;
			x2 = x1;
			B = A;
			x1 = a+(1-q)*(b-a);
			A = code.eval({x:x1});
		}else{
			a = x1;
			x1 = x2; 
			A = B; 
			x2 = b-(1-q)*(b-a); 
			B = code.eval({x:x2}); 
		}
	}
	var x = (a+b)/2;
	x = Math.abs(x)<accuracy ? 0:x;
	return x;
}

function F(n) {
    var f; 
    var f1 = 1;
    var f2 = 1;
    var m = 0;
    while(m < n - 1)
    {
        f = f1 + f2;
        f1 = f2;
        f2 = f;
        ++m;
    }
    return f1;
}

function getFibonacciExtremum(expression, interval1, interval2, accuracy) {
    var eps = accuracy;
    node=math.parse(expression);
    code=node.compile();
    var xf1 = 1;
    var xf2 = 1;
    var N = 0;
    var iteration = 0;
    var fn1 = 1;
    var fn2 = 1;
    var fn;
    var f = (interval2 - interval1)/accuracy;
    while(fn1 < f){
        fn = fn1 + fn2;
        fn1 = fn2;
        fn2 = fn;
        ++N;
    }
    var x1 = interval1 + F(N - 2) / F(N) * (interval2 - interval1) - (N%2 == 0 ? -1 : 1) * accuracy / F(N);
    var x2 = interval1 + F(N - 1) / F(N) * (interval2 - interval1) + (N%2 == 0 ? -1 : 1) * accuracy / F(N);
    xf1 = code.eval({x:x1});
    xf2 = code.eval({x:x2});
    while(math.abs(interval2 - interval1) <= accuracy){
        iteration++;
        if(xf1 >= xf2){
            interval1 = x1;
            x1 = x2;
            xf1 = xf2;
            x2 = interval1 + F(N - iteration - 1) / F(N - iteration) * (interval2 - interval1) + ((N - iteration)%2 == 0 ? -1 : 1) * accuracy / F(N - iteration);
            xf2 = code.eval({x:x2}); 
        }
        else{
            interval2 = x2;
            x2 = x1;
            xf2 = xf1;
            x1 = interval1 + F(N - iteration - 2) / F(N - iteration) * (interval2 - interval1) - ((N - iteration)%2 == 0 ? -1 : 1) * accuracy / F(N - iteration);
            xf1 = code.eval({x:x1});
        }
    }
    var x = (x1+x2)/2;
    return x;
}

expr.oninput = function () {
    let node = null;

    try {
        // parse the expression
        node = math.parse(expr.value);

        // evaluate the result of the expression
        //result.innerHTML = math.format(node.compile().eval());
    }
    catch (err) {
        //result.innerHTML = '<span style="color: red;">' + err.toString() + '</span>';
        console.log('<span style="color: red;">' + err.toString() + '</span>');
    }

    try {
        // export the expression to LaTeX
        let latex = node ? node.toTex({parenthesis: parenthesis, implicit: implicit}) : '';
        console.log('LaTeX expression:', latex);

        // display and re-render the expression
        let elem = MathJax.Hub.getAllJax('function')[0];
        MathJax.Hub.Queue(['Text', elem, latex]);
    }
    catch (err) {
    }
};