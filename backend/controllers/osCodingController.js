import db from "../config/db.js";

const normalize = (text = "") =>
  text
    .replace(/\r/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const checkOSAnswer =
  async (req, res) => {

    try {

      const {
        questionId,
        answer,
      } = req.body;

      const [testCases] =
        await db.query(
          `
          SELECT *
          FROM coding_test_cases
          WHERE question_id = ?
          `,
          [questionId]
        );

      if (
        !testCases.length
      ) {

        return res
          .status(404)
          .json({
            error:
              "Test case not found",
          });
      }

      const expected =
        testCases[0]
          .expected_output;

      const passed =
        normalize(expected).includes(
          normalize(answer)
        );

      return res.json({

        verdict: passed
          ? "passed"
          : "failed",

        passedTests: passed
          ? 1
          : 0,

        totalTests: 1,

        points: passed
          ? 10
          : 0,

        results: [
          {
            passed,

            input:
              testCases[0]
                .input_data,

            expected,

            output:
              answer,
          },
        ],
      });

    } catch (error) {

      console.error(
        "OS Coding Error:",
        error
      );

      return res
        .status(500)
        .json({
          error:
            "Failed to check answer",
        });
    }
  };

export {
  checkOSAnswer,
};