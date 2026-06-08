import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import {
  APPLICANT_NAME,
  parseLetterSections,
  prepareCoverLetterForPdf,
} from "@/lib/prepareCoverLetterForPdf";

const INK = "#1A1A1A";
const MUTED = "#555555";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    fontSize: 11,
    color: INK,
    paddingTop: 56,
    paddingBottom: 56,
    paddingHorizontal: 64,
    lineHeight: 1.55,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 36,
  },
  applicantName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  date: {
    fontSize: 10,
    color: MUTED,
    textAlign: "right",
  },
  recipientBlock: {
    marginBottom: 28,
  },
  recipientLine: {
    fontSize: 11,
    marginBottom: 3,
  },
  recipientCompany: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  reLine: {
    fontSize: 10.5,
    color: MUTED,
    marginTop: 8,
  },
  salutation: {
    marginBottom: 16,
    fontSize: 11,
  },
  paragraph: {
    marginBottom: 14,
    fontSize: 11,
    lineHeight: 1.65,
    textAlign: "justify",
  },
  closingBlock: {
    marginTop: 22,
  },
  closing: {
    marginBottom: 28,
    fontSize: 11,
  },
  signature: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
});

export type CoverLetterPdfProps = {
  coverLetter: string;
  companyName: string;
  jobTitle: string | null;
  generatedAt: Date;
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function CoverLetterPdfDocument({
  coverLetter,
  companyName,
  jobTitle,
  generatedAt,
}: CoverLetterPdfProps) {
  const prepared = prepareCoverLetterForPdf(coverLetter);
  const { salutation, paragraphs, closing, signature } = parseLetterSections(prepared);

  return (
    <Document
      title={`${APPLICANT_NAME} — ${companyName}`}
      author={APPLICANT_NAME}
      subject={jobTitle ?? "Application"}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.applicantName}>{APPLICANT_NAME}</Text>
          </View>
          <Text style={styles.date}>{formatDate(generatedAt)}</Text>
        </View>

        <View style={styles.recipientBlock}>
          <Text style={styles.recipientCompany}>{companyName}</Text>
          <Text style={styles.recipientLine}>Hiring Manager</Text>
          {jobTitle ? <Text style={styles.reLine}>Re: {jobTitle}</Text> : null}
        </View>

        {salutation ? <Text style={styles.salutation}>{salutation}</Text> : null}

        {paragraphs.map((paragraph) => (
          <Text key={paragraph.slice(0, 56)} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}

        <View style={styles.closingBlock}>
          <Text style={styles.closing}>{closing ?? "Sincerely,"}</Text>
          <Text style={styles.signature}>{signature}</Text>
        </View>
      </Page>
    </Document>
  );
}
