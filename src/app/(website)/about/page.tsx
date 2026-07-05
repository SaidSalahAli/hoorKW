'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Like1, ShieldSecurity, CallCalling, Clock } from '@wandersonalwes/iconsax-react';
import ScrollReveal from 'components/ScrollReveal';

// ==============================|| ABOUT US PAGE ||============================== //

export default function AboutPage() {
  return (
    <Box>
      {/* Page Header banner */}
      <Box
        sx={{
          color: 'white',
          py: { xs: 10, md: 14 },
          position: 'relative',
          overflow: 'hidden',
          backgroundImage:
            'linear-gradient(135deg, rgba(6, 13, 31, 0.95) 0%, rgba(15, 23, 42, 0.9) 40%, rgba(26, 39, 68, 0.95) 100%), url(/assets/images/home/hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          textAlign: 'center'
        }}
      >
        {/* Decorative blurred circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(250,204,21,0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            left: '20%',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(250,204,21,0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <ScrollReveal direction="up">
            <Typography variant="h1" fontWeight={900} sx={{ fontSize: { xs: '2.4rem', md: '3.4rem' }, mb: 2 }}>
              من نحن
            </Typography>
            <Typography variant="h6" sx={{ color: 'grey.400', fontWeight: 400, maxWidth: 720, mx: 'auto', lineHeight: 1.7 }}>
              تعرف على شركة الحور - رواد نقل وتغليف الأثاث المنزلي والمكتبي في دولة الكويت
            </Typography>
          </ScrollReveal>
        </Container>
      </Box>

      {/* Main Intro */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <ScrollReveal direction="left">
              <Box sx={{ display: 'inline-block', bgcolor: 'rgba(234,179,8,0.08)', px: 2, py: 0.5, borderRadius: 1.5, mb: 2 }}>
                <Typography variant="overline" color="#eab308" fontWeight={800} sx={{ letterSpacing: 1.5 }}>
                  من نحن
                </Typography>
              </Box>
              <Typography
                variant="h2"
                fontWeight={800}
                sx={{ mb: 3, color: '#1e293b', fontSize: { xs: '2rem', md: '2.6rem' }, lineHeight: 1.3 }}
              >
                تاريخنا ورؤيتنا في <br />
                <Box component="span" sx={{ color: '#eab308' }}>
                  التميز والريادة بالكويت
                </Box>
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.9, fontSize: '1.08rem', mb: 3 }}>
                انطلقت شركة الحور لنقل العفش في دولة الكويت واضعةً نصب عينيها هدفاً أساسياً: تقديم تجربة نقل أثاث سلسة، آمنة ومريحة لجميع
                عملائنا. بفضل ثقتكم، استطعنا على مر السنوات بناء سمعة متميزة تمثل مرادفاً للأمان والدقة والسرعة في المعاملات.
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.9, fontSize: '1.08rem', mb: 3 }}>
                نعتمد في جميع عملياتنا على فريق عمل فني متكامل يضم نجارين فك وتركيب محترفين، عمال تحميل وتنزيل مدربين بكفاءة عالية، وسائقين
                ذوي معرفة تامة بجميع مناطق وطرق الكويت (من الجهراء إلى الأحمدي، السالمية، الفروانية وغيرها).
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, fontSize: '1.08rem' }}>
                نحرص على استخدام أفضل خامات التغليف العالمية من كرتون مضلع، رول بابلز، فوم، وبلاستيك استرتش لحماية الأثاث أثناء عمليات
                التحميل والنقل.
              </Typography>
            </ScrollReveal>
          </Grid>
          <Grid item xs={12} md={6}>
            <ScrollReveal direction="right">
              <Box
                sx={{
                  color: '#0f172a',
                  p: { xs: 4, md: 6 },
                  borderRadius: 4,
                  boxShadow: '0 12px 36px rgba(250,204,21,0.2)',
                  background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)'
                }}
              >
                <Typography variant="body1" paragraph sx={{ opacity: 0.9, lineHeight: 1.8, fontSize: '1.05rem', mt: 2 }}>
                  نحن لا نقوم فقط بنقل قطع الأثاث الخاصة بك، بل نعمل بأقصى جهد للمحافظة على سلامتها وحمايتها، مع اتباع معايير سلامة صارمة
                  لتفادي حدوث أي تلفيات.
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.8, fontSize: '1.05rem' }}>
                  ثق بنا ودع عناء التفكير والجهد البدني لنا، وانعم بالراحة والاسترخاء أثناء قيامنا بنقل وتجهيز منزلك الجديد.
                </Typography>
              </Box>
            </ScrollReveal>
          </Grid>
        </Grid>
      </Container>

      {/* Values Section */}
      <Box sx={{ py: 12, bgcolor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
        <Container maxWidth="lg">
          <ScrollReveal direction="up">
            <Box textAlign="center" mb={8}>
              <Box sx={{ display: 'inline-block', bgcolor: 'rgba(234,179,8,0.08)', px: 2.5, py: 0.6, borderRadius: 10, mb: 2 }}>
                <Typography variant="caption" color="#eab308" fontWeight={800} sx={{ letterSpacing: 1 }}>
                  قيمنا ورسالتنا
                </Typography>
              </Box>
              <Typography variant="h2" fontWeight={800} color="#0f172a" sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                القيم التي نؤمن بها ونعمل بموجبها
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxW: 600, mx: 'auto', lineHeight: 1.8 }}>
                نرتكز في تعاملنا اليومي مع العملاء على ركائز ثابتة تضمن جودة الخدمة وسلامة المنقولات.
              </Typography>
            </Box>
          </ScrollReveal>

          <Grid container spacing={4}>
            {[
              {
                icon: <ShieldSecurity size={36} variant="Bulk" />,
                title: 'الأمانة والموثوقية',
                desc: 'نهتم بخصوصية عملائنا ونحافظ على جميع الممتلكات الشخصية والأغراض الثمينة بأمانة تامة.'
              },
              {
                icon: <Like1 size={36} variant="Bulk" />,
                title: 'الاحترافية المهنية',
                desc: 'نختار كوادرنا الفنية بعناية لضمان كفاءة عالية في التعامل مع جميع أنواع العفش والمطابخ والأجهزة.'
              },
              {
                icon: <Clock size={36} variant="Bulk" />,
                title: 'احترام المواعيد',
                desc: 'ندرك أهمية وقت عملائنا، لذا نلتزم بالدقة المتناهية في مواعيد الحضور والبدء وعملية النقل.'
              },
              {
                icon: <CallCalling size={36} variant="Bulk" />,
                title: 'الدعم والتواصل المستمر',
                desc: 'خدمة عملاء جاهزة للرد على جميع استفساراتك واستقبال طلباتك على مدار 24 ساعة طوال أيام الأسبوع.'
              }
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <ScrollReveal direction="zoom" delay={idx * 0.1}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      p: 2,
                      border: '1px solid #e2e8f0',
                      bgcolor: '#ffffff',
                      transition: 'all 0.3s',
                      '&:hover': { transform: 'translateY(-5px)', borderColor: '#eab308', boxShadow: '0 10px 30px rgba(234,179,8,0.05)' }
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: '50%',
                          bgcolor: 'rgba(234,179,8,0.08)',
                          color: '#eab308',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 3
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography variant="h5" fontWeight={800} mb={1.5} color="#1e293b">
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {item.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
