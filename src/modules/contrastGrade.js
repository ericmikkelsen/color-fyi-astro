export default (contrast,aaa = false) => {
    let grade = 'fail'
    if(aaa && contrast >= 7){
        grade = 'aaa'
    } else if(contrast >= 4.5){
        grade = 'aa'
    } else if (4.5 > contrast && contrast >= 3) {
        grade = 'aalarge'
    }
    return grade;
}