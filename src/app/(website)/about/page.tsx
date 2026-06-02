'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Like1, ShieldSecurity, CallCalling, Clock } from '@wandersonalwes/iconsax-react';

// ==============================|| ABOUT US PAGE ||============================== //

export default function AboutPage() {
  return (
    <Box>
      {/* Page Header banner */}
      <Box sx={{ bgcolor: '#0f172a', color: 'white', py: 8, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="h1" fontWeight={800} gutterBottom>
            من نحن
          </Typography>
          <Typography variant="h5" color="grey.400" fontWeight={400}>
            تعرف على شركة حور - رواد نقل وتغليف الأثاث المنزلي والمكتبي في دولة الكويت
          </Typography>
        </Container>
      </Box>

      {/* Main Intro */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              تاريخنا ورؤيتنا في التميز والريادة
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
              انطلقت شركة حور لنقل العفش في دولة الكويت واضعةً نصب عينيها هدفاً أساسياً: تقديم تجربة نقل أثاث سلسة، آمنة ومريحة لجميع عملائنا. بفضل ثقتكم، استطعنا على مر السنوات بناء سمعة متميزة تمثل مرادفاً للأمان والدقة والسرعة في المعاملات.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
              نعتمد في جميع عملياتنا على فريق عمل فني متكامل يضم نجارين فك وتركيب محترفين، عمال تحميل وتنزيل مدربين بكفاءة عالية، وسائقين ذوي معرفة تامة بجميع مناطق وطرق الكويت (من الجهراء إلى الأحمدي، السالمية، الفروانية وغيرها).
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
              نحرص على استخدام أفضل خامات التغليف العالمية من كرتون مضلع، رول بابلز، فوم، وبلاستيك استرتش لحماية الأثاث أثناء عمليات التحميل والنقل.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                p: { xs: 4, md: 6 },
                borderRadius: 4,
                boxShadow: '0 10px 30px rgba(24,144,255,0.2)'
              }}
            >
              <Typography variant="h4" fontWeight={700} gutterBottom>
                الضمان الشامل لسلامة عفشك
              </Typography>
              <Typography variant="body1" paragraph sx={{ opacity: 0.9, lineHeight: 1.8 }}>
                نحن لا نقوم فقط بنقل قطع الأثاث الخاصة بك، بل نتحمل المسؤولية الكاملة عن سلامتها وحمايتها. في حال حدوث أي تلفيات (لا قدر الله)، فإن الشركة تضمن لعملائها تعويضاً عادلاً.
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.8 }}>
                ثق بنا ودع عناء التفكير والجهد البدني لنا، وانعم بالراحة والاسترخاء أثناء قيامنا بنقل وتجهيز منزلك الجديد.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Values Section */}
      <Box sx={{ py: 10, bgcolor: '#f1f5f9' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" fontWeight={800} align="center" gutterBottom>
            القيم التي نؤمن بها ونعمل بموجبها
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 6, maxW: 600, mx: 'auto' }}>
            نرتكز في تعاملنا اليومي مع العملاء على ركائز ثابتة تضمن جودة الخدمة وسلامة المنقولات.
          </Typography>
          <Grid container spacing={4}>
            {[
              { icon: <ShieldSecurity size={36} />, title: 'الأمانة والموثوقية', desc: 'نهتم بخصوصية عملائنا ونحافظ على جميع الممتلكات الشخصية والأغراض الثمينة بأمانة تامة.' },
              { icon: <Like1 size={36} />, title: 'الاحترافية المهنية', desc: 'نختار كوادرنا الفنية بعناية لضمان كفاءة عالية في التعامل مع جميع أنواع العفش والمطابخ والأجهزة.' },
              { icon: <Clock size={36} />, title: 'احترام المواعيد', desc: 'ندرك أهمية وقت عملائنا، لذا نلتزم بالدقة المتناهية في مواعيد الحضور والبدء وعملية النقل.' },
              { icon: <CallCalling size={36} />, title: 'الدعم والتواصل المستمر', desc: 'خدمة عملاء جاهزة للرد على جميع استفساراتك واستقبال طلباتك على مدار 24 ساعة طوال أيام الأسبوع.' }
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card sx={{ height: '100%', borderRadius: 3, p: 1, border: 'none', boxShadow: 'none', bgcolor: 'transparent' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ color: 'primary.main', mb: 2, display: 'inline-flex' }}>
                      {item.icon}
                    </Box>
                    <Typography variant="h5" fontWeight={700} mb={1}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
