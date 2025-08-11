import styled, { keyframes } from "styled-components";
import { CgSpinnerTwo } from "react-icons/cg";
import {useTranslation} from "react-i18next";


const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const SpinnerIcon = styled(CgSpinnerTwo )`
    animation: ${spin} 1s linear infinite;
    font-size: var(--font-size-4xl);
    color: var(--color-primary-bg);
`;

export default function Spinner() {

    const { t } = useTranslation();

    return <SpinnerIcon aria-label={t('loading_spinner')} />;
}
