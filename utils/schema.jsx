import Validate from './validate'
import * as yup from 'yup';

export const registerSchema = yup.object().shape({
    attendeeName: yup.string().required('Nome deve ser preenchido').max(255, 'Deve respeitar o limite máximo de 255 caracteres'),
    attendeeChosenName: yup.string().max(255, 'Deve respeitar o limite máximo de 255 caracteres'),
    attendeeEmail: yup.string().required('E-mail deve ser preenchido').email('E-mail inválido').max(255, 'Deve respeitar o limite máximo de 255 caracteres'),
    attendeeEmailConfirmation: yup.string().required('Confirmação de e-mail deve ser preenchido').oneOf([yup.ref('attendeeEmail'), null], 'Confirmação de e-mail deve ser igual ao e-mail'),
    attendeePhone: yup.string().required('Telefone deve ser preenchido').max(32, 'Deve respeitar o limite máximo de 32 caracteres'),
    attendeeOccupationId: yup.number().required('Profissão deve ser selecionada'),
    attendeeOccupationOther: yup.string().max(255, 'Deve respeitar o limite máximo de 255 caracteres')
        .when('attendeeOccupation', {
            is: (attendeeOccupation) => false && attendeeOccupation === '6',
            then: yup.string().required('Descrição da profissão deve ser preenchida').max(255, 'Deve respeitar o limite máximo de 255 caracteres')
        }),
    attendeeDisabilityYN: yup.bool().required('Pessoa com deficiência deve ser preenchido').oneOf([true, false], 'Pessoa com Deficiência deve ser Sim ou Não'),
    attendeeDisability: yup.string()
        .when('attendeeDisabilityYN', {
            is: (attendeeDisabilityYN) => attendeeDisabilityYN,
            then: yup.string().required('Descrição da necessidade de atendimento especial deve ser preenchida').max(255, 'Deve respeitar o limite máximo de 255 caracteres')
        }),
    attendeeDocument: yup.string().required('CPF deve ser preenchido').test(
        'test-invalid-cpf',
        'CPF inválido',
        (cpf) => Validate.validateCPF(cpf)),
    statement: yup.array().of(
        yup.object().shape({
            text: yup.string().required('Texto do enunciado deve ser preenchido').max(800, 'Deve respeitar o limite máximo de 800 caracteres'),
            justification: yup.string().required('Justificativa do enunciado deve ser preenchida').max(1600, 'Deve respeitar o limite máximo de 1600 caracteres'),
            committeeId: yup.number().required('Comissão deve ser seleciondada')
        }))
});

