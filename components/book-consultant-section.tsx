"use client";

import { InlineWidget } from "react-calendly";
import { Header } from "./header";
import { Footer } from "./footer";

export default function BookConsultation() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Book a Paid Consultation
        </h1>
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-4">
          {/* Calendly embedded form */}
          <InlineWidget
            url="https://ablink.send.calendly.com/ls/click?upn=u001.-2FpFZHOmNsCfytAyhc9roxASrXX5vciM1hh-2Bt0fWL9NRe5U29UKdZZs5oQVEuN-2FmzLvOwusRaMHnmx1KGt92gp2DLEMviTT0FRCWg9oHQnCw6HSiXW3AW12pDL78h5SpDXnzjXmPw-2FCPD8San1b0mNEhYoEO4XmGPgeYjlkZpX-2Fiphc7PHdFiOueajFmKS5TqhUbP0cXPq-2BOCkOOBSHrla61WQsv0ShPRH8A8dtje8MA-2FX-2BHlRFaB2RStGDG6MwQyOUj6xDH2yHE09aAXNWXh6w-3D-3Dd6oh_HlOU-2F2NUvJUBLiRvCjh5R6MrOtiRpITNS7gTVnTHRQqTNbQE1mu7hqLLWwLI5WSFHp0bHTqI9bnVS5RKzT-2FQB492u-2FQXL-2Bg9RGcX3eW6qnsW60xjNitFPJG0XlcDZpwFZtkLxeKkagZAAuRPWmXpDu6dc0ZMhbc6j6x5EYeQ1xg3avB2QFhmiKbz-2Bs0zpl4s12YkkDs-2B7Q6rW7PGk8pLrg26yQmvz80WApizobLoTULkFIi9Zs5mfld67251YRLXhnNBJd9h-2FQZ5xKlgBLoNiKGmmmRoSOn7GwiIVuKd3W2bD3k-2Bhw5M5VqrK5BcZ7G0qIWHB51DMqPmvCGMwZksnBmrNYadfmNbvXSr6-2FF0m-2By546a6CmlUnMVjgHn4mJlz-2Bfzzp-2FcLHmLwdwjdymLQDVr-2FQmbJwnyL96xk3HpsqEtxBDnnjt-2B3LEzrCimIFeWq0Q5Yj8ZvMvS1syatf858rqUw9VLdbNOOKcsORuG8Sd-2BxU1pBXTVqAw7kCJuIocFaGTBca-2FfC4FldHj-2Bk9l8OH1KtvzGwCme4iTVDC2CmfhMYIrkwI2qlp2e3nW-2BPU3NPsRbMnUs11Ejjid4FekDRc0Jtj43ExFEi7vcjoIocySv0zdLbFj4NxtVvrN2Rlirp4EOnj2ky0CG4yFNRkErX8sSKT0cVQcRkBilHFlytcjZrYLSUtvkDahjlqeNJSliFOBiVRkeOEW0Sa50wv36quhe9oIuqZifFDDEnTEa4QHE0QHfNqi08lCUrRHgLzyAb"
            styles={{ height: "700px" }}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
