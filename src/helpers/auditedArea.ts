/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
export const auditedArea = (item) => {
    if (!item?.extremeCoordinates && !item?.auditedArea) {
        return "Área não auditada";
    }
    else if (item?.extremeCoordinates && item?.extremeCoordinates.length >= 3 && item?.auditedArea) {
        return `${item?.auditedArea}`;
    }
    else if (item?.extremeCoordinates && item?.extremeCoordinates.length >= 3 && !item?.auditedArea) {
        return "Área auditada mas não calculada";
    }
    else if (item?.extremeCoordinates && item?.extremeCoordinates.length < 3){
        return "Auditaria da área não concluída";
    }
    else {
        return "Auditaria da área não iniciada";
    }
};
