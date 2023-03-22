'use strict';

const config = require('../../../../app/config');
const assert = require('assert');
const { describe, it, beforeEach } = require('mocha');
const _ = require('lodash');
const { utils } = require('@storyous/common-utils');
const api = require('../../../apiTestUtil');
const mockMailer = require('../../../mockMailer');
const mockedSaltGlobal = require('../../../mockedSaltGlobal');
const merchantStates = require('../../../../app/models/merchants/merchantStates');
const ApiTestController = require('../apiTestController');
const { countryCodes } = require('../../../../app/models/i18n');
require('../../../mockedApi');
require('../../../mockedRolesService');

const jsonData = {
    'active': true,
    'name': 'My Store Name',
    'mcc': '5812',
    // 'borgun_industry_code': '1234',
    'id': '1004f1fc-be52-4405-9d4f-c60f0d8e990a',
    // 'store_type': 'PHYSICAL',
    // 'active': true,
    'phone_number': '351112378',
    'phone_country_code': '420',
    'version': 1,
    'address': {
        'city': 'My City',
        'country': 'IS',
        // 'state': 'Some state',
        'street_address_line_1': 'Street A',
        'street_address_line_2': 'Street B',
        'street_address_line_3': 'Street C',
        'zipcode': '123'
    },
    'company': {
        'billing_email': 'billing@email.com',
        'authorizer': {
            // 'country': 'BRA',
            'email': 'firstlast@email.com',
            'first_name': 'John',
            'id': 'ffe1cd43-1f43-47f5-afa7-438d5baef783',
            'last_name': 'Doe',
            'user_id': 'user-saltid/ffe1cd43-1f43-47f5-afa7-438d5baef784',
            'phone_number': '351112348',
            'phone_country_code': '420',
            'version': 1
        },
        'registered_address': {
            'city': 'My City',
            'country': 'IS',
            // 'state': 'Some state',
            'street_address_line_1': 'Street A',
            'street_address_line_2': 'Street C',
            'street_address_line_3': 'Street C',
            'zipcode': '123'
        },
        // 'business_legal_structure': 'SOLE_TRADER',
        'charging_bank_account': {
            'bank_currency': 'EUR',
            // 'billing_language': 'BRA',
            'iban': 'FR76 3000 6000 0112 3456 7890 189'
            // 'id': '0fa1ae62-63a0-47db-a0e4-b277e84388ab',
        },
        'vat_number': 'IS123456',
        'id': '0fa1ae62-63a0-47db-a0e4-b277e84388ab',
        'registered_name': 'My Company',
        'registered_number': '123456789',
        'version': 1
    }
};

/**
 * Creates data coming from GMD
 * @param {Object} options
 * @param {string} options.countryCode
 * @param {Object} options.companyData
 * @param {Object} options.placeData
 * @returns {Object}
 */
function getNewNamespace (options = {}) {
    let firstPlaceJson = _.cloneDeep(jsonData);

    firstPlaceJson.id = utils.generateRandomAlphanumeric(10);
    const merchantGlobalDataId = utils.generateRandomAlphanumeric(10);
    firstPlaceJson.company.id = merchantGlobalDataId;
    firstPlaceJson.company.registered_number = utils.generateRandomAlphanumeric(10);
    firstPlaceJson.company.authorizer.id = utils.generateRandomAlphanumeric(10);
    firstPlaceJson.company.authorizer.email = firstPlaceJson.company.authorizer.email.replace('@', `${_.uniqueId()}@`);

    if (options.countryCode) {
        firstPlaceJson.address.country = options.countryCode;
        firstPlaceJson.company.registered_address.country = options.countryCode;
    }
    if (options.companyData) {
        firstPlaceJson.company = {
            ...firstPlaceJson.company,
            ...options.companyData
        };
    }
    if (options.placeData) {
        firstPlaceJson = {
            ...firstPlaceJson,
            ...options.placeData
        };
    }

    const secondPlaceJson = _.cloneDeep(firstPlaceJson);
    secondPlaceJson.id = utils.generateRandomAlphanumeric(10);

    return {
        merchantGlobalDataId,
        firstPlaceJson,
        secondPlaceJson
    };
}

const getMerchant = async (merchantGlobalDataId) => {
    const { body: { data: merchants } } = await api.request().get('/merchants').set({ Authorization: api.bearer() });
    return merchants.find((merchant) => merchant.gmd.globalDataId === merchantGlobalDataId) || null;
};

const setAgreement = async (merchantGlobalDataId, merchantState) => {
    const merchant = await getMerchant(merchantGlobalDataId);
    const response = await api.request().put(`/agreements/${merchant.merchantId}`)
        .set({ Authorization: api.bearer() }).send({ state: merchantState });
    return response.body;
};

const getAgreement = async (merchantGlobalDataId) => {
    const merchant = await getMerchant(merchantGlobalDataId);
    const response = await api.request().get(`/agreements/${merchant.merchantId}`).set({ Authorization: api.bearer() });
    return response.body;
};

const getPlaces = async (merchantGlobalDataId) => {
    const merchant = await getMerchant(merchantGlobalDataId);
    console.log(merchant);
    const { body: { data: places } } = await api.request().get(`/places?merchantId=${merchant.merchantId}`).set({ Authorization: api.bearer() });
    return places;
};

const getPerson = async (merchantGlobalDataId) => {
    const merchant = await getMerchant(merchantGlobalDataId);
    const { body: { data: [person] } } = await api.request().get(`/persons?merchantId=${merchant.merchantId}`).set({ Authorization: api.bearer() });
    return person;
};

const getCompanyWithAuthorizerData = (namespace, companyVersion = 2, authorizerVersion = 2) => _.defaultsDeep(
    {
        version: companyVersion,
        registered_name: 'aaa',
        registered_number: '12345431',
        authorizer: {
            version: authorizerVersion,
            first_name: 'Joe',
            address: {
                country: 'IS',
                zipcode: '123',
                street_address_line_1: '',
                street_address_line_2: '',
                street_address_line_3: ''
            }
        }
    },
    namespace.firstPlaceJson.company
);

const getPersonData = (namespace, version = 2) => _.defaultsDeep(

    {
        version,
        address: {
            country: 'IS',
            zipcode: '123',
            street_address_line_1: '',
            street_address_line_2: '',
            street_address_line_3: ''
        }
    },
    namespace.firstPlaceJson.company.authorizer
);
const getStoreData = (storeVersion = 2) => ({
    name: 'aaa',
    phone_number: '123456789',
    phone_country_code: '421',
    version: storeVersion
});

async function validateMerchantWithSaltData (merchantGlobalDataId, placeJson) {
    const data = placeJson;
    const merchant = await getMerchant(merchantGlobalDataId);
    const company = data.company;
    const cAddress = company.registered_address;

    const mapping = { // a sample merchant to work with
        company: company.registered_name,
        street: `${cAddress.street_address_line_1}`,
        town: cAddress.city,
        zip: cAddress.zipcode,
        businessId: company.registered_number,
        countryCode: cAddress.country,
        vatId: company.vat_number,
        invoiceEmail: company.billing_email,
        isVatPayer: !!company.vat_number
    };

    assert.deepStrictEqual(_.pick(merchant, Object.keys(mapping)), mapping);
    assert.deepStrictEqual(company.id, merchant.gmd.globalDataId);
    return merchant;
}

async function validatePlaceWithSaltData (merchantGlobalDataId, placeJson) {
    const placeData = placeJson;
    const [place] = await getPlaces(merchantGlobalDataId);
    const merchant = await getMerchant(merchantGlobalDataId);
    const pAddress = placeData.address;
    const mapping = {
        name: placeData.name,
        address: `${pAddress.street_address_line_1}`,
        city: pAddress.city,
        zip: pAddress.zipcode,
        phoneNumber: `+${placeData.phone_country_code} ${placeData.phone_number}`,
        merchantId: merchant.merchantId
    };

    assert.deepStrictEqual(_.pick(place, Object.keys(mapping)), mapping);
    assert.deepStrictEqual(placeData.id, place.gmd.globalDataId);
}

async function validatePersonWithSaltData (merchantGlobalDataId, placeJson) {
    const authorizerData = placeJson.company.authorizer;
    const merchant = await getMerchant(merchantGlobalDataId);
    const person = await getPerson(merchantGlobalDataId);
    const mapping = {
        fullName: `${authorizerData.first_name} ${authorizerData.last_name}`,
        gmd: { globalDataId: authorizerData.id },
        email: authorizerData.email,
        username: authorizerData.email.split('@')[0],
        lang: 'is',
        hasFirstLoginToken: true,
        groups: [
            {
                group: 'merchant', merchantId: merchant.merchantId, placeId: null, allianceId: null
            }
        ]
    };

    const gmd = _.pick(person.gmd, ['globalDataId']);
    person.gmd = gmd;

    assert.deepStrictEqual(_.pick(person, Object.keys(mapping)), mapping);
    assert.deepStrictEqual(authorizerData.id, person.gmd.globalDataId);

    var sentMails = mockMailer.sentMail();

    assert(sentMails.length > 0, 'No email was sent.');
    assert(sentMails.some(function (email) {
        return email.data.subject.indexOf('Login detail') >= 0
               && email.data.text.indexOf(mapping.username) >= 0
               && email.data.text.indexOf(config.mainBrand.adminUrl) >= 0;
    }), 'No valid email was sent.');
}

let namespace = null;

describe('Salt Global Data API', () => {
    api.before();
    mockMailer.useForBlock();

    const defaultHeaders = {
        'x-api-key': `${config.saltGlobalData.incomingTokens[0]}`
    };

    const activateStore = async (body, {
        headers = defaultHeaders,
        expectedStatus = 200
    } = {}) => (api.request()
        .put('/salt-global-data/api/v1/stores')
        .set(headers)
        .send(body)
        .expect(expectedStatus));

    const deactivateStore = async (storeId, {
        headers = defaultHeaders,
        expectedStatus = 200
    } = {}) => (api.request()
        .delete(`/salt-global-data/api/v1/stores/${storeId}`)
        .set(headers)
        .expect(expectedStatus));

    const newDataEvent = async (body, {
        headers = defaultHeaders,
        expectedStatus = 200
    } = {}) => (api.request()
        .post('/salt-global-data/api/v1/data')
        .set(headers)
        .send(body)
        .expect(expectedStatus));

    beforeEach(() => {
        namespace = getNewNamespace();
    });

    it('should create merchant, person and place by activating product', async () => {
        await activateStore(namespace.firstPlaceJson, {});
        await validateMerchantWithSaltData(namespace.merchantGlobalDataId, namespace.firstPlaceJson);
        await validatePlaceWithSaltData(namespace.merchantGlobalDataId, namespace.firstPlaceJson);
        await validatePersonWithSaltData(namespace.merchantGlobalDataId, namespace.firstPlaceJson);
    });

    it('should handle two registrations of same merchant in a row', async () => {
        await activateStore(namespace.firstPlaceJson, {});
        await activateStore(namespace.firstPlaceJson, {});
        await validateMerchantWithSaltData(namespace.merchantGlobalDataId, namespace.firstPlaceJson);
        await validatePlaceWithSaltData(namespace.merchantGlobalDataId, namespace.firstPlaceJson);
        await validatePersonWithSaltData(namespace.merchantGlobalDataId, namespace.firstPlaceJson);
    });

    it('should handle two registrations of different merchant with same businessId', async () => {
        await activateStore(namespace.firstPlaceJson, {});
        const newNamespace = getNewNamespace();
        const newJson = newNamespace.firstPlaceJson;
        newJson.company.registered_number = namespace.firstPlaceJson.company.registered_number;
        await activateStore(newJson, {});
        await validateMerchantWithSaltData(namespace.merchantGlobalDataId, namespace.firstPlaceJson);
        await validatePlaceWithSaltData(namespace.merchantGlobalDataId, namespace.firstPlaceJson);
        await validateMerchantWithSaltData(namespace.merchantGlobalDataId, namespace.firstPlaceJson);
        await validatePlaceWithSaltData(namespace.merchantGlobalDataId, namespace.firstPlaceJson);
    });

    it('should handle two registrations in a row', async () => {
        await Promise.all([
            activateStore(namespace.firstPlaceJson, {}),
            activateStore(namespace.firstPlaceJson, {}),
            activateStore(namespace.firstPlaceJson, {})
        ]);
    });

    it('should end with 422 on wrong input', async () => {

        const invalidValues = {
            'id': undefined,
            'name': ' ',
            'address.zipcode': '999999',
            'address.country': 'RU' // we don't support Russia
        };

        for (const [fieldPath, value] of Object.entries(invalidValues)) {
            console.log('TESTING', fieldPath);

            const invalidJson = _.cloneDeep(namespace.firstPlaceJson);
            _.set(invalidJson, fieldPath, value);

            // eslint-disable-next-line no-await-in-loop
            const { body: responseBody } = await activateStore(invalidJson, { expectedStatus: 422 });
            assert.deepStrictEqual(Object.keys(responseBody), ['errors'], `bad behaviour for ${fieldPath}`);

            // eslint-disable-next-line no-await-in-loop
            const merchant = await getMerchant(namespace.merchantGlobalDataId);
            assert.strictEqual(merchant, null, `merchant should not be created for field ${fieldPath}`);
        }
    });

    it('should end with 401 with wrong credentials', async () => {
        await activateStore(namespace.firstPlaceJson, {
            expectedStatus: 401,
            headers: { 'x-api-key': 'wrong' }
        });
        const merchant = await getMerchant(namespace.merchantGlobalDataId);
        assert(merchant === null);
    });

    it('should be possible deactivate place and merchant by deactivating product', async () => {
        await activateStore(namespace.firstPlaceJson);
        await activateStore(namespace.secondPlaceJson);

        let agreement = await getAgreement(namespace.merchantGlobalDataId);
        assert.strictEqual(agreement.state, merchantStates.BEFORE_AGREEMENT); // before agreement
        let places = await getPlaces(namespace.merchantGlobalDataId);
        assert.strictEqual(places[0].state, 'active');
        assert.strictEqual(places[1].state, 'active');

        await deactivateStore(namespace.firstPlaceJson.id);
        agreement = await getAgreement(namespace.merchantGlobalDataId);
        assert.strictEqual(agreement.state, merchantStates.BEFORE_AGREEMENT); // before agreement
        places = await getPlaces(namespace.merchantGlobalDataId);
        assert.strictEqual(places[0].state, 'active');
        assert.strictEqual(places[1].state, 'disabled');

        await deactivateStore(namespace.secondPlaceJson.id);
        agreement = await getAgreement(namespace.merchantGlobalDataId);
        assert.strictEqual(agreement.state, merchantStates.DISABLED); // before agreement
        places = await getPlaces(namespace.merchantGlobalDataId);
        assert.strictEqual(places[0].state, 'disabled');
        assert.strictEqual(places[1].state, 'disabled');
    });

    it('should be possible deactivate place and merchant by deactivating all places at once', async () => {
        await activateStore(namespace.firstPlaceJson);
        await activateStore(namespace.secondPlaceJson);

        await Promise.all([
            deactivateStore(namespace.firstPlaceJson.id),
            deactivateStore(namespace.secondPlaceJson.id)
        ]);

        const agreement = await getAgreement(namespace.merchantGlobalDataId);
        assert.strictEqual(agreement.state, merchantStates.DISABLED); // before agreement
        const places = await getPlaces(namespace.merchantGlobalDataId);
        assert.strictEqual(places[0].state, 'disabled');
        assert.strictEqual(places[1].state, 'disabled');
    });

    // TODO: temporarily skipped because of TODO in app/models/globalMerchantDatabase/logic/updateRegistration.js (line 211)
    it.skip('should reactivate deactivated merchant and place', async () => {
        await activateStore(namespace.firstPlaceJson);
        await deactivateStore(namespace.firstPlaceJson.id);

        let places = await getPlaces(namespace.merchantGlobalDataId);
        assert.strictEqual(places[0].state, 'disabled');
        let agreement = await getAgreement(namespace.merchantGlobalDataId);
        assert.strictEqual(agreement.state, merchantStates.DISABLED); // before agreement

        await activateStore(namespace.firstPlaceJson);
        agreement = await getAgreement(namespace.merchantGlobalDataId);
        assert.strictEqual(agreement.state, merchantStates.BEFORE_AGREEMENT); // before agreement
        places = await getPlaces(namespace.merchantGlobalDataId);
        assert.strictEqual(places[0].state, 'active');
    });

    it.skip('should reactivate deactivated second place when merchant and first place are still active', async () => {
        await activateStore(namespace.firstPlaceJson);
        await activateStore(namespace.secondPlaceJson);
        await deactivateStore(namespace.secondPlaceJson.id);

        let places = await getPlaces(namespace.merchantGlobalDataId);
        assert.strictEqual(places[0].state, 'disabled'); // second place
        assert.strictEqual(places[0].globalDataId, namespace.secondPlaceJson.id);
        assert.strictEqual(places[1].state, 'active'); // first place
        const agreement = await getAgreement(namespace.merchantGlobalDataId);
        assert.strictEqual(agreement.state, merchantStates.BEFORE_AGREEMENT);

        await activateStore(namespace.secondPlaceJson);
        places = await getPlaces(namespace.merchantGlobalDataId);
        assert.strictEqual(places[0].state, 'active');
    });

    // TODO: temporarily skipped because of TODO in app/models/globalMerchantDatabase/logic/updateRegistration.js (line 211)
    it.skip('should reactivate deactivated merchant and place when agreement already accepted', async () => {
        await activateStore(namespace.firstPlaceJson);

        const merchant = await getMerchant(namespace.merchantGlobalDataId);
        const person = await getPerson(namespace.merchantGlobalDataId);

        const apiTestController = new ApiTestController();
        await apiTestController.createPersonController(person).setDefaultPassword();
        const merchantController = await apiTestController.loadMerchant(merchant.merchantId, person.personId);
        await merchantController.makeTheMerchantRunning(); // agree with terms and conditions BEFORE_AGREEMENT -> RUNNING

        let agreement = await getAgreement(namespace.merchantGlobalDataId);
        assert.strictEqual(agreement.state, merchantStates.RUNNING);

        await deactivateStore(namespace.firstPlaceJson.id);
        let places = await getPlaces(namespace.merchantGlobalDataId);
        assert.strictEqual(places[0].state, 'disabled');
        agreement = await getAgreement(namespace.merchantGlobalDataId);
        assert.strictEqual(agreement.state, merchantStates.DISABLED);

        await activateStore(namespace.firstPlaceJson);
        agreement = await getAgreement(namespace.merchantGlobalDataId);
        assert.strictEqual(agreement.state, merchantStates.RUNNING);
        places = await getPlaces(namespace.merchantGlobalDataId);
        assert.strictEqual(places[0].state, 'active');
    });

    it('should return 400 when activating merchant with state DATA_DELETED', async () => {
        await activateStore(namespace.firstPlaceJson);
        await setAgreement(namespace.merchantGlobalDataId, merchantStates.DATA_DELETED);
        const agreement = await getAgreement(namespace.merchantGlobalDataId);
        assert.strictEqual(agreement.state, merchantStates.DATA_DELETED);

        await activateStore(namespace.firstPlaceJson, { expectedStatus: 400 });
    });

    it('should be able to update merchant and person', async () => {
        await activateStore(namespace.firstPlaceJson);

        const updatedData = getCompanyWithAuthorizerData(namespace);

        mockedSaltGlobal.getCompany.handleNext((ctx, next) => {
            ctx.body = updatedData;
            next();
        });

        await newDataEvent({
            id: namespace.firstPlaceJson.company.id,
            model_name: 'company'
        });

        const updatedMerchant = await getMerchant(namespace.merchantGlobalDataId);
        const updatedPerson = await getPerson(namespace.merchantGlobalDataId);
        const updatedAuthorizer = updatedData.authorizer;

        assert.strictEqual(updatedMerchant.company, updatedData.registered_name);
        assert.strictEqual(updatedMerchant.businessId, updatedData.registered_number);
        assert.strictEqual(
            updatedPerson.fullName,
            `${updatedAuthorizer.first_name} ${updatedAuthorizer.last_name}`
        );
        assert.strictEqual(updatedMerchant.gmd.globalDataVersion, 2);
        assert.strictEqual(updatedPerson.gmd.globalDataVersion, 2);

        assert.strictEqual(updatedPerson.gmd.updateGmd, false);
        assert.strictEqual(updatedMerchant.gmd.updateGmd, false);
    });

    it('should be able to update Slovak merchant and person', async () => {
        const namespace = getNewNamespace({
            countryCode: countryCodes.SK,
            companyData: {
                vat_number: 'SK1234567890',
                registered_address: {
                    city: 'My City',
                    country: 'SK',
                    street_address_line_1: 'Street A',
                    street_address_line_2: 'Street C',
                    street_address_line_3: 'Street C',
                    zipcode: '98559'
                }
            },
            placeData: {
                address: {
                    city: 'My City',
                    country: 'SK',
                    // 'state': 'Some state',
                    street_address_line_1: 'Street A',
                    street_address_line_2: 'Street B',
                    street_address_line_3: 'Street C',
                    zipcode: '98559'
                }
            }
        });
        await activateStore(namespace.firstPlaceJson);

        const updatedData = getCompanyWithAuthorizerData(namespace);

        mockedSaltGlobal.getCompany.handleNext((ctx, next) => {
            ctx.body = updatedData;
            next();
        });

        await newDataEvent({
            id: namespace.firstPlaceJson.company.id,
            model_name: 'company'
        });

        const updatedMerchant = await getMerchant(namespace.merchantGlobalDataId);
        const updatedPerson = await getPerson(namespace.merchantGlobalDataId);
        const updatedAuthorizer = updatedData.authorizer;

        assert.strictEqual(updatedMerchant.company, updatedData.registered_name);
        assert.strictEqual(updatedMerchant.businessId, updatedData.registered_number);
        assert.strictEqual(
            updatedPerson.fullName,
            `${updatedAuthorizer.first_name} ${updatedAuthorizer.last_name}`
        );
        assert.strictEqual(updatedMerchant.gmd.globalDataVersion, 2);
        assert.strictEqual(updatedPerson.gmd.globalDataVersion, 2);

        assert.strictEqual(updatedPerson.gmd.updateGmd, false);
        assert.strictEqual(updatedMerchant.gmd.updateGmd, false);
    });

    it('should not update merchant when incoming company version is lower', async () => {
        namespace = getNewNamespace();
        namespace.firstPlaceJson.company.version = 10;
        namespace.firstPlaceJson.company.authorizer.version = 10;
        await activateStore(namespace.firstPlaceJson);

        const updatedData = getCompanyWithAuthorizerData(namespace, 8, 11);

        mockedSaltGlobal.getCompany.handleNext((ctx, next) => {
            ctx.body = updatedData;
            next();
        });

        await newDataEvent({
            id: namespace.firstPlaceJson.company.id,
            model_name: 'company'
        });

        const updatedMerchant = await getMerchant(namespace.merchantGlobalDataId);
        const updatedPerson = await getPerson(namespace.merchantGlobalDataId);
        const updatedAuthorizer = updatedData.authorizer;

        assert.strictEqual(updatedMerchant.company, namespace.firstPlaceJson.company.registered_name);
        assert.strictEqual(updatedMerchant.businessId, namespace.firstPlaceJson.company.registered_number);
        assert.strictEqual(
            updatedPerson.fullName,
            `${updatedAuthorizer.first_name} ${updatedAuthorizer.last_name}`
        );
        assert.strictEqual(updatedMerchant.gmd.globalDataVersion, 10);
        assert.strictEqual(updatedPerson.gmd.globalDataVersion, 11);

        assert.strictEqual(updatedMerchant.gmd.updateGmd, true);
        assert.strictEqual(updatedPerson.gmd.updateGmd, false);
    });

    it('should not update person when incoming person version is lower', async () => {
        namespace = getNewNamespace();
        namespace.firstPlaceJson.company.version = 10;
        namespace.firstPlaceJson.company.authorizer.version = 10;
        await activateStore(namespace.firstPlaceJson);

        const updatedData = getCompanyWithAuthorizerData(namespace, 11, 8);

        mockedSaltGlobal.getCompany.handleNext((ctx, next) => {
            ctx.body = updatedData;
            next();
        });

        await newDataEvent({
            id: namespace.firstPlaceJson.company.id,
            model_name: 'company'
        });

        const updatedMerchant = await getMerchant(namespace.merchantGlobalDataId);
        const updatedPerson = await getPerson(namespace.merchantGlobalDataId);
        const authorizer = namespace.firstPlaceJson.company.authorizer;

        assert.strictEqual(updatedMerchant.company, updatedData.registered_name);
        assert.strictEqual(updatedMerchant.businessId, updatedData.registered_number);
        assert.strictEqual(
            updatedPerson.fullName,
            `${authorizer.first_name} ${authorizer.last_name}`
        );
        assert.strictEqual(updatedMerchant.gmd.globalDataVersion, 11);
        assert.strictEqual(updatedPerson.gmd.globalDataVersion, 10);

        assert.strictEqual(updatedMerchant.gmd.updateGmd, false);
        assert.strictEqual(updatedPerson.gmd.updateGmd, true);
    });

    it('should be able to update place', async () => {
        await activateStore(namespace.firstPlaceJson);

        const updatedData = getStoreData();

        mockedSaltGlobal.getStore.handleNext((ctx, next) => {
            ctx.body = { ...namespace.firstPlaceJson, ...updatedData };
            next();
        });

        await newDataEvent({
            'id': namespace.firstPlaceJson.id,
            'model_name': 'store'
        });

        const [updatedPlace] = await getPlaces(namespace.merchantGlobalDataId);
        assert.strictEqual(updatedPlace.name, updatedData.name);
        assert.strictEqual(updatedPlace.phoneNumber, `+${updatedData.phone_country_code} ${updatedData.phone_number}`);
        assert.strictEqual(updatedPlace.gmd.globalDataVersion, 2);
        assert.strictEqual(updatedPlace.gmd.updateGmd, false);
    });

    it('should be able to update person', async () => {
        namespace = getNewNamespace();
        await activateStore(namespace.firstPlaceJson);
        const personId = namespace.firstPlaceJson.company.authorizer.id;
        const updatedData = {
            ...getPersonData(namespace, 2),
            first_name: 'Jack',
            last_name: 'Black'
        };

        mockedSaltGlobal.getPeopleById.handleNext((ctx, next) => {
            ctx.body = { ...namespace.firstPlaceJson, ...updatedData };
            next();
        });

        await newDataEvent({
            'id': personId,
            'model_name': 'person'
        });

        const updatedPerson = await getPerson(namespace.merchantGlobalDataId);
        assert.strictEqual(updatedPerson.firstName, 'Jack');
        assert.strictEqual(updatedPerson.lastName, 'Black');
        assert.strictEqual(updatedPerson.gmd.globalDataVersion, 2);
        assert.strictEqual(updatedPerson.gmd.updateGmd, false);
    });

    it('should not update person when incoming version is lower', async () => {
        namespace = getNewNamespace();
        namespace.firstPlaceJson.company.authorizer.version = 10;
        const personId = namespace.firstPlaceJson.company.authorizer.id;
        await activateStore(namespace.firstPlaceJson);

        const updatedData = getPersonData(namespace);

        mockedSaltGlobal.getPeopleById.handleNext((ctx, next) => {
            ctx.body = { ...namespace.firstPlaceJson, ...updatedData };
            next();
        });

        await newDataEvent({
            'id': personId,
            'model_name': 'person'
        });

        const updatedPerson = await getPerson(namespace.merchantGlobalDataId);
        assert.strictEqual(updatedPerson.firstName, namespace.firstPlaceJson.company.authorizer.first_name);
        assert.strictEqual(updatedPerson.gmd.globalDataVersion, 10);
        assert.strictEqual(updatedPerson.gmd.updateGmd, true);
    });

    it('should not update person when last_name is coming not_filled', async () => {
        namespace = getNewNamespace();
        await activateStore(namespace.firstPlaceJson);
        const personId = namespace.firstPlaceJson.company.authorizer.id;
        const updatedData = {
            ...getPersonData(namespace, 2),
            last_name: 'not_filled'
        };

        mockedSaltGlobal.getPeopleById.handleNext((ctx, next) => {
            ctx.body = { ...namespace.firstPlaceJson, ...updatedData };
            next();
        });

        await newDataEvent({
            'id': personId,
            'model_name': 'person'
        });

        const updatedPerson = await getPerson(namespace.merchantGlobalDataId);
        // value: <actual value of updatedPerson.lastName>
        assert.strictEqual(updatedPerson.lastName, namespace.firstPlaceJson.company.authorizer.last_name);
        assert.notStrictEqual(updatedPerson.gmd._globalData.last_name, updatedPerson.lastName);
        assert.strictEqual(updatedPerson.gmd._globalData.last_name, 'not_filled');

    });

    it('should end with status code 500 for unknown model_name', async () => {
        await activateStore(namespace.firstPlaceJson);
        await newDataEvent({
            'id': namespace.firstPlaceJson.company.id,
            'model_name': 'somethingUnknown'
        }, {
            expectedStatus: 500
        });
    });

    // -------------------------------------------------------------------------------------

    it.only('should handle two registrations of different merchant with same businessId', async () => {
        await activateStore(namespace.subscriptionPostPayload, namespace.firstStore, namespace.company, {});
        // const newNamespace = getNewNamespace();
        // const newJson = newNamespace.firstStore;

        // -----------------------

        namespace.secondStore.company_id = utils.generateRandomAlphanumeric(12);

        // const secondStoreCompany = _.cloneDeep(company);
        // secondStoreCompany.id = secondStore.company_id;

        // -----------------------

        const secondCompany = _.cloneDeep(namespace.company);
        secondCompany.id = namespace.secondStore.company_id;
        secondCompany.registered_number = namespace.company.registered_number;

        await activateStore(namespace.secondSubscriptionPostPayload, namespace.secondStore, secondCompany, {});
        await validateMerchantWithSaltData(namespace.merchantGlobalDataId, namespace.company);
        await validatePlaceWithSaltData(namespace.merchantGlobalDataId, namespace.firstStore);
        await validateMerchantWithSaltData(namespace.merchantGlobalDataId, namespace.company);
        await validatePlaceWithSaltData(namespace.merchantGlobalDataId, namespace.firstStore);
    });

    // -------------------------------------------------------------------------------------
});
