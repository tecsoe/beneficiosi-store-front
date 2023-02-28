import FirstStep from "./FirstStep";
import FourStep from "./FourStep";
import SecondStep from "./SecondStep";
import ThirdStep from "./ThirdStep";

const ProductForm = ({
    activeStep,
    onSubmitStep,
    onCancel,
    values,
    data,
    onComplete,
    onChange,
    findTags,
    loadingTags,
    findTagsFilterValue,
    onAddVideo,
    onRemoveVideo,
    onAddFeature,
    onRemoveFeature,
    onAddFeatureGroup,
    onRemoveFeatureGroup,
    isEdit
}) => {



    const handleStepSubmited = (e) => {
        onSubmitStep({ actualStep: activeStep, ...e })
    }

    const handleGoBack = () => {
        onCancel(activeStep);
    }

    return (
        <div>
            <FirstStep
                values={values.FirstStepValues}
                data={data.FirstStepData}
                goBack={handleGoBack}
                onSubmit={handleStepSubmited}
                show={activeStep === 1}
                onChange={onChange}
                onAddVideo={onAddVideo}
                onRemoveVideo={onRemoveVideo}
            />
            <SecondStep
                values={values.SecondStepValues}
                data={data.SecondStepData}
                goBack={handleGoBack}
                onSubmit={handleStepSubmited}
                findTags={findTags}
                findTagsFilterValue={findTagsFilterValue}
                loadingTags={loadingTags}
                show={activeStep === 2}
                onChange={onChange} />
            <ThirdStep
                values={values.ThirdStepValues}
                goBack={handleGoBack}
                onSubmit={handleStepSubmited}
                show={activeStep === 3}
                onChange={onChange}
                onAddFeature={onAddFeature}
                onRemoveFeature={onRemoveFeature}
                onAddFeatureGroup={onAddFeatureGroup}
                onRemoveFeatureGroup={onRemoveFeatureGroup}
            />
            <FourStep
                values={values.FourStepValues}
                data={data.FourStepData}
                goBack={handleGoBack}
                onSubmit={onComplete}
                show={activeStep === 4}
                onChange={onChange}
                isEdit={isEdit} />
        </div>
    )
}

export default ProductForm;