
function updateCalculations() {
    let totalCompliantArea = 0;
    let totalCarpetArea = 0;

    // Loop from 1 to 10 (adjust as needed)
    for (let i = 1; i <= 10; i++) {
        const spaceType = $(`[name="space-type${i}"]`);
        const baselineInput = $(`[name="baseline-maximum-value${i}"]`);
        const measuredInput = $(`[name="measured-value${i}"]`);
        const carpetAreaInput = $(`[name="carpet-area${i}"]`);
        const complianceInput = $(`[name="meets-credit-complaince${i}"]`);
        const compliantAreaInput = $(`[name="compliant-area${i}"]`);

        const spaceTypeVal = spaceType.val();
        const baselineVal = spaceTypeVal === "Enclosed office" ? 35 : 40;
        baselineInput.val(baselineVal);

        var measuredValue = parseFloat(measuredInput.val());
        var carpetArea = parseFloat(carpetAreaInput.val());

        let isCompliant = false;
        let compliantArea = 0;
        if(!measuredValue){
            measuredValue = 0;
        }
        if (!isNaN(measuredValue)) {
           
            isCompliant = measuredValue <= baselineVal;
            complianceInput.val(isCompliant ? "TRUE" : "FALSE");

            compliantArea = isCompliant ? measuredValue : 0;
            compliantAreaInput.val(compliantArea);

            totalCompliantArea += compliantArea;
            totalCarpetArea += measuredValue;
        } else {
            complianceInput.val("");
            compliantAreaInput.val("");
        }
    }

    $('#office-area-meeting').val(totalCompliantArea.toFixed(2));
    $('#total-office-area').val(totalCarpetArea.toFixed(2));

    const percentage = totalCarpetArea > 0 ? (totalCompliantArea / totalCarpetArea) * 100 : 0;
    $('#percentage-of-area-meeting').val(percentage.toFixed(2));
}

$(document).ready(function () {
    $('[name^="space-type"], [name^="measured-value"], [name^="carpet-area"]').on('input change', updateCalculations);
    updateCalculations(); // Initial run
});