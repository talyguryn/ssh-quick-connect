const https = require('https');

const Dates = require('./dates');

const CheckCertificate = (domain) => {
    return new Promise((resolve, reject) => {
        https.get(domain, {agent: false}, response => {
            const certificate = response.connection.getPeerCertificate();

            if (!certificate.valid_to) reject(new Error(`Unable to get SSL-certificate expiration date for domain ${domain}`));

            resolve({
                statusCode: response.statusCode,
                sslExpireDate: new Date(certificate.valid_to)
            });
        })
            .on('error', reject);
    });
};

const CheckPaidTillDate = require('./check-paid-till-date');

/**
 * Site domain to be checked
 * @type {string}
 */
module.exports = async (URL) => {
    const response = {
        statusCode: null,
        sslExpireDays: null,
        paidTillDays: null
    };

    try {
        /**
         * Check SSL certificate
         */
        await CheckCertificate(URL)
            .then(({ statusCode, sslExpireDate }) => {
                response.statusCode = statusCode;
                response.sslExpireDays = Dates.countDays(sslExpireDate);
            })
            .catch(error => {
                if (error.code === 'CERT_HAS_EXPIRED') {
                    response.sslExpireDays = -1;
                }

                if (error.code === 'ENOTFOUND') {
                    response.sslExpireDays = -1;
                    response.statusCode = 404;
                }

                throw error;
            })
            .catch((e) => {
                // console.error(e);
            });

        /**
         * Check domain's registry expiry date
         */
        await CheckPaidTillDate(URL)
            .then(({ paidTillDate }) => {
                response.paidTillDays = Dates.countDays(paidTillDate)
            })
            .catch((e) => {
                // console.error(e);
            });
    } catch (error) {}

    return response;
}
