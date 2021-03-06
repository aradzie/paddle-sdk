import { fetch } from '../../src/helpers/fetch'
import FormData from 'form-data'
import nodeFetch from 'node-fetch'

jest.mock('node-fetch', () => jest.fn())

function mockNextNodeFetchCall(json: any) {
  ;((nodeFetch as unknown) as jest.Mock).mockImplementationOnce(async () => ({
    json: async () => json,
  }))
}

function getLastNodeFetchCall() {
  return ((nodeFetch as unknown) as jest.Mock).mock.calls[0]
}

describe('helpers -> fetch', () => {
  beforeEach(() => {
    ;((nodeFetch as unknown) as jest.Mock).mockClear()
  })

  it('can make a fetch request using a form data body', async () => {
    mockNextNodeFetchCall({ success: true, response: { foo: 'bar' } })

    const response = await fetch('https://example.com', {
      method: 'POST',
      body: { baz: 42, ree: undefined },
    })
    expect(response).toMatchSnapshot()

    const request = getLastNodeFetchCall()
    expect(request[0]).toEqual('https://example.com')
    expect(request[1].method).toEqual('POST')
    expect(request[1].body).toBeInstanceOf(FormData)
  })
})
