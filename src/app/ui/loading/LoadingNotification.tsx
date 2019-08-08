import React, { FunctionComponent } from 'react';

import { TranslatedString } from '../../language';

export interface LoadingNotificationProps {
    isLoading: boolean;
}

const LoadingNotification: FunctionComponent<LoadingNotificationProps> = ({
    isLoading,
}) => {
    if (!isLoading) {
        return null;
    }

    return (
        <div className="loadingNotification">
            <div className="loadingNotification-label optimizedCheckout-loadingToaster">
                <div className="spinner"></div>

                <span className="label">
                    <TranslatedString id="common.loading_text" />
                </span>
            </div>
        </div>
    );
};

export default LoadingNotification;