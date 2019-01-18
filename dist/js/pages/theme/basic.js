function getColor(cl) {
	if (cl == 'd' || cl == 'txt-red') return 'red';
	if (cl == 'i' || cl == 'txt-lime') return '#0f0';
	if (cl == 'e') return '#ffd900';
	if (cl == 'c' || cl == 'ceiling') return '#ff25ff';
    if (cl == 'f' || cl == 'floor') return '#1eeeee';
    
    return '#f0f0f0';
}

function getClassIndex(cPrice, oPrice) {

    if (cPrice - oPrice > 0) {
        return '#0f0';
    } else if (cPrice - oPrice < 0) {
        return 'red';
    }
    return '#ffd900';
}

function getcolorOther(val){
    if(val == '0') return '#f0f0f0';
    if(val.toString().includes('-')) return 'red';
    return '#0f0';
}

getColor10Gia = function (tc, tran, san, gia) {
	// console.log(tc + ' - ' + tran + ' - ' + san + ' - ' + gia);
	if (gia == '0') return '#ff25ff';
	if (StringToFloat(gia) == StringToFloat(tran)) return '#ff25ff';
	if (StringToFloat(gia) == StringToFloat(san)) return '#1eeeee';
	if (StringToFloat(gia) == StringToFloat(tc)) return '#ffd900';
	if (StringToFloat(gia) < StringToFloat(tc)) {
		return 'red';
	} else {
		return '#0f0';
	}
}

getBackground = function(){
	return '#171717';
}