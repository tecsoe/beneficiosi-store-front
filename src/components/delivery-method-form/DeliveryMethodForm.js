import FirstStep from "./FirstStep";
import FourStep from "./FourStep";
import SecondStep from "./SecondStep";
import ThirdStep from "./ThirdStep";

const DeliveryMethodForm = ({ activeStep, onSubmitStep, deliveryTypes, deliveryType, onCancel, zones, ranges, onComplete }) => {

    const handleStepSubmited = (e) => {
        console.log(e);
        onSubmitStep({ actualStep: activeStep, ...e })
    }

    const handleGoBack = () => {
        onCancel(activeStep);
    }

    return (
        <div>
            <FirstStep deliveryTypes={deliveryTypes} goBack={handleGoBack} onSubmit={handleStepSubmited} show={activeStep === 1} />
            <SecondStep goBack={handleGoBack} onSubmit={handleStepSubmited} show={activeStep === 2} />
            <ThirdStep goBack={handleGoBack} deliveryType={deliveryType} onSubmit={handleStepSubmited} show={activeStep === 3} />
            <FourStep zones={zones} ranges={ranges} deliveryType={deliveryType} goBack={handleGoBack} onSubmit={onComplete} show={activeStep === 4} />
        </div>
    )
}

export default DeliveryMethodForm;