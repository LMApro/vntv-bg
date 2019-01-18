function getColor(cl) {
	if (cl == 'd' || cl == 'txt-red') return '#DA5664';
	if (cl == 'i' || cl == 'txt-lime') return '#50C979';
	if (cl == 'e') return '#d1af54';
	if (cl == 'c' || cl == 'ceiling') return '#A976D3';
    if (cl == 'f' || cl == 'floor') return '#00b7d7';
    
    return '#C6CBDE';
}

function getClassIndex(cPrice, oPrice) {

    if (cPrice - oPrice > 0) {
        return '#50C979';
    } else if (cPrice - oPrice < 0) {
        return '#DA5664';
    }
    return '#d1af54';
}

function getcolorOther(val){
    if(val == '0') return '#C6CBDE';
    if(val.toString().includes('-')) return 'rgb(218, 86, 100)';
    return 'rgb(80, 201, 121)';
}

getColor10Gia = function (tc, tran, san, gia) {
	// console.log(tc + ' - ' + tran + ' - ' + san + ' - ' + gia);
	if (gia == '0') return '#A976D3';
	if (StringToFloat(gia) == StringToFloat(tran)) return '#A976D3';
	if (StringToFloat(gia) == StringToFloat(san)) return '#00b7d7';
	if (StringToFloat(gia) == StringToFloat(tc)) return '#d1af54';
	if (StringToFloat(gia) < StringToFloat(tc)) {
		return '#DA5664';
	} else {
		return '#50C979';
	}
}

getBackground = function(){
	return '#242736';
}